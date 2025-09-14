#!/usr/bin/env python3
"""
Base Agent Class for Healthcare AI System
Provides common functionality for all specialized agents
"""

import google.generativeai as genai
import os
import logging
import json
from typing import Dict, Any, List, Optional
from datetime import datetime
import uuid

logger = logging.getLogger(__name__)

class BaseAgent:
    """
    Base class for all AI agents in the healthcare system
    Provides common functionality including Gemini API integration,
    logging, error handling, and response formatting
    """
    
    def __init__(self, knowledge_store, patient_db, agent_type: str = "base"):
        """Initialize base agent with required dependencies"""
        self.knowledge_store = knowledge_store
        self.patient_db = patient_db
        self.agent_type = agent_type
        
        # Initialize Gemini API
        api_key = os.getenv('GOOGLE_API_KEY')
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable is required")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        
        logger.info(f"{agent_type.title()} agent initialized successfully")
    
    def _create_system_prompt(self, specific_instructions: str) -> str:
        """Create system prompt with common healthcare guidelines"""
        base_prompt = """
You are a healthcare AI assistant designed to help with patient triage and care.

IMPORTANT GUIDELINES:
- You are NOT a replacement for professional medical advice
- Always recommend seeking professional medical care for serious symptoms
- Be empathetic and professional in all interactions
- Ask clarifying questions to better understand patient symptoms
- Focus on gathering information for proper triage
- Never provide specific diagnoses - only general information
- Always prioritize patient safety

CONTEXT:
- You are part of a multi-agent healthcare system
- Your responses will be used by other agents for triage decisions
- Maintain patient privacy and confidentiality
- Document all interactions for continuity of care

"""
        return base_prompt + "\n" + specific_instructions
    
    def _generate_response(self, prompt: str, patient_context: Dict = None) -> str:
        """Generate response using Gemini API with error handling"""
        try:
            # Include patient context if available
            if patient_context:
                context_str = f"\nPATIENT CONTEXT:\n{json.dumps(patient_context, indent=2)}\n"
                prompt = context_str + prompt
            
            # Generate response
            response = self.model.generate_content(prompt)
            
            if not response.text:
                raise ValueError("Empty response from Gemini API")
            
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"Failed to generate AI response: {str(e)}")
            return self._get_fallback_response()
    
    def _get_fallback_response(self) -> str:
        """Provide fallback response when AI generation fails"""
        return ("I apologize, but I'm experiencing technical difficulties. "
                "Please contact a healthcare professional directly if you have "
                "urgent medical concerns.")
    
    def _extract_structured_data(self, text: str, structure_type: str) -> Dict:
        """Extract structured data from AI response"""
        try:
            # Use AI to convert text response to structured data
            extraction_prompt = f"""
Extract the following information from the text and return as JSON:
Text: {text}

For {structure_type}, extract:
- symptoms: list of symptoms mentioned
- severity_indicators: list of severity markers
- questions: list of follow-up questions
- recommendations: list of recommendations
- confidence_level: confidence in assessment (1-10)

Return only valid JSON:
"""
            
            response = self.model.generate_content(extraction_prompt)
            
            try:
                return json.loads(response.text)
            except json.JSONDecodeError:
                # Fallback to manual parsing
                return self._manual_parse_response(text, structure_type)
                
        except Exception as e:
            logger.error(f"Failed to extract structured data: {str(e)}")
            return self._get_default_structure(structure_type)
    
    def _manual_parse_response(self, text: str, structure_type: str) -> Dict:
        """Manual parsing fallback for structured data extraction"""
        # Basic keyword-based extraction
        symptoms = []
        questions = []
        recommendations = []
        
        lines = text.split('\n')
        for line in lines:
            line = line.strip()
            if '?' in line:
                questions.append(line)
            elif any(word in line.lower() for word in ['recommend', 'suggest', 'should']):
                recommendations.append(line)
            elif any(word in line.lower() for word in ['pain', 'ache', 'hurt', 'symptom']):
                symptoms.append(line)
        
        return {
            'symptoms': symptoms[:5],  # Limit to 5 items
            'severity_indicators': [],
            'questions': questions[:3],
            'recommendations': recommendations[:3],
            'confidence_level': 5
        }
    
    def _get_default_structure(self, structure_type: str) -> Dict:
        """Return default structure when parsing fails"""
        return {
            'symptoms': [],
            'severity_indicators': [],
            'questions': ["Can you tell me more about your symptoms?"],
            'recommendations': ["Please consult with a healthcare professional"],
            'confidence_level': 1
        }
    
    def _log_interaction(self, patient_id: str, interaction_type: str, 
                        input_data: Dict, output_data: Dict, 
                        processing_time: float = None):
        """Log agent interaction for monitoring and debugging"""
        try:
            log_entry = {
                'timestamp': datetime.now().isoformat(),
                'agent_type': self.agent_type,
                'patient_id': patient_id,
                'interaction_type': interaction_type,
                'processing_time_seconds': processing_time,
                'input_summary': {
                    'keys': list(input_data.keys()),
                    'message_length': len(str(input_data.get('message', '')))
                },
                'output_summary': {
                    'keys': list(output_data.keys()),
                    'response_length': len(str(output_data.get('response', '')))
                },
                'success': True
            }
            
            # Log to patient database audit log
            self.patient_db.log_audit_event(
                patient_id=patient_id,
                action=f'{self.agent_type}_interaction',
                details=json.dumps(log_entry)
            )
            
        except Exception as e:
            logger.error(f"Failed to log interaction: {str(e)}")
    
    def _validate_input(self, required_fields: List[str], data: Dict) -> bool:
        """Validate that required fields are present in input data"""
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            logger.error(f"Missing required fields: {missing_fields}")
            return False
        return True
    
    def _create_conversation_id(self) -> str:
        """Generate unique conversation ID"""
        return f"{self.agent_type}_{uuid.uuid4().hex[:8]}_{int(datetime.now().timestamp())}"
    
    def _assess_urgency_indicators(self, text: str) -> Dict[str, Any]:
        """Identify urgency indicators in patient message"""
        high_urgency_keywords = [
            'severe', 'intense', 'excruciating', 'unbearable', 
            'can\'t breathe', 'chest pain', 'crushing', 'radiating',
            'sudden', 'worst ever', 'emergency', '911', 'help'
        ]
        
        medium_urgency_keywords = [
            'moderate', 'concerning', 'worsening', 'spreading',
            'nausea', 'vomiting', 'fever', 'difficulty'
        ]
        
        text_lower = text.lower()
        
        high_urgency_count = sum(1 for keyword in high_urgency_keywords 
                               if keyword in text_lower)
        medium_urgency_count = sum(1 for keyword in medium_urgency_keywords 
                                 if keyword in text_lower)
        
        urgency_level = 'low'
        if high_urgency_count > 0:
            urgency_level = 'high'
        elif medium_urgency_count > 0:
            urgency_level = 'medium'
        
        return {
            'urgency_level': urgency_level,
            'high_urgency_indicators': high_urgency_count,
            'medium_urgency_indicators': medium_urgency_count,
            'keywords_found': [kw for kw in high_urgency_keywords + medium_urgency_keywords 
                             if kw in text_lower]
        }
    
    def _format_medical_response(self, response_text: str, 
                               additional_data: Dict = None) -> Dict[str, Any]:
        """Format response with consistent structure"""
        base_response = {
            'response': response_text,
            'agent_type': self.agent_type,
            'timestamp': datetime.now().isoformat(),
            'conversation_id': self._create_conversation_id(),
            'confidence_score': 7,  # Default confidence
            'requires_followup': True
        }
        
        if additional_data:
            base_response.update(additional_data)
        
        return base_response
    
    def health_check(self) -> bool:
        """Check if agent is functioning properly"""
        try:
            # Test AI model
            test_response = self.model.generate_content("Test message")
            
            # Test database connections
            if hasattr(self.knowledge_store, 'health_check'):
                if not self.knowledge_store.health_check():
                    return False
            
            if hasattr(self.patient_db, 'health_check'):
                if not self.patient_db.health_check():
                    return False
            
            return True
            
        except Exception as e:
            logger.error(f"Agent health check failed: {str(e)}")
            return False
    
    def get_agent_info(self) -> Dict[str, Any]:
        """Get information about this agent"""
        return {
            'agent_type': self.agent_type,
            'model': 'gemini-pro',
            'initialized_at': datetime.now().isoformat(),
            'capabilities': ['text_generation', 'symptom_analysis', 'medical_guidance'],
            'status': 'active'
        }