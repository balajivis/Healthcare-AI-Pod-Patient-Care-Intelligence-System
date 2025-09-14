# Healthcare AI Pod: Patient Care Intelligence System

A production-ready healthcare AI system for intelligent patient triage, built for the Modern AI Pro Practitioner course.

## 🏥 Project Overview

This system combines cutting-edge AI technologies to create an intelligent patient triage system that demonstrates all 4 pillars of modern AI implementation:

- **Multi-agent healthcare system** with intelligent triage
- **RAG-powered medical knowledge base** with real-time retrieval  
- **Context-aware patient conversations** with persistent memory
- **Production deployment** with HIPAA-compliant monitoring

## 🛠️ Technology Stack

- **Backend**: Python Flask with multi-agent framework
- **AI Model**: Google Gemini API for agent orchestration
- **Vector Database**: ChromaDB for medical knowledge embeddings
- **Relational Database**: SQLite3 for patient data and conversations
- **Frontend**: React.js with real-time chat components
- **Deployment**: AWS EC2 with Docker containerization
- **Security**: HIPAA-compliant encryption and audit logging

## 📁 Project Structure

```
Healthcare-AI-Pod/
├── backend/
│   ├── app.py                    # Main Flask application
│   ├── requirements.txt          # Python dependencies
│   ├── models/                   # Database models
│   ├── agents/                   # AI agent implementations
│   ├── database/                 # Database managers
│   ├── data/                     # Medical knowledge base
│   └── utils/                    # Security and monitoring
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   └── services/             # API clients
├── scripts/                      # Setup and deployment
└── docs/                         # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- Google Gemini API key
- AWS EC2 instance (for deployment)

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/balajivis/Healthcare-AI-Pod-Patient-Care-Intelligence-System.git
cd Healthcare-AI-Pod-Patient-Care-Intelligence-System
```

2. **Set up the backend**:
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
```

3. **Initialize databases**:
```bash
python ../scripts/setup_chromadb.py
python ../scripts/setup_database.py
python ../scripts/load_medical_data.py
```

4. **Start the backend**:
```bash
python app.py
```

5. **Set up the frontend** (in a new terminal):
```bash
cd frontend
npm install
npm start
```

## 🏗️ System Architecture

The system uses a multi-agent architecture with four specialized agents:

- **Intake Agent**: Collects patient symptoms and medical history
- **Triage Agent**: Assesses urgency and recommends actions
- **Knowledge Agent**: Retrieves relevant medical information
- **Escalation Agent**: Manages handoffs to human providers

## 📊 Medical Knowledge Base

The system includes comprehensive medical data:

- **500+ symptoms** with severity indicators and red flags
- **200+ medical conditions** with treatment protocols
- **Drug interaction database** with safety alerts
- **Escalation rules** with urgency thresholds
- **Treatment guidelines** based on current medical standards

## 🔒 HIPAA Compliance

Built with healthcare privacy in mind:

- End-to-end encryption of patient data
- Comprehensive audit logging
- Role-based access controls
- Data retention policies
- Secure session management

## 🎯 Learning Objectives

This project demonstrates:

1. **Context Design & Management**: Patient memory and conversation flows
2. **Advanced RAG Techniques**: Medical knowledge retrieval with ChromaDB
3. **Multi-Agent Orchestration**: Coordinated AI agents for complex tasks
4. **Production Deployment**: Scalable, secure, and monitored systems

## 📈 Performance Metrics

The system tracks:

- Triage accuracy and consistency
- Patient satisfaction scores
- Response times and system availability
- Escalation rates and clinical outcomes
- Cost optimization and resource usage

## 🚀 Deployment

### Local Development
```bash
python app.py
```

### EC2 Production Deployment
```bash
# SSH into EC2 instance
ssh -i keypair.pem ubuntu@<ec2-ip>

# Run deployment script
./scripts/deploy_to_ec2.sh
```

### Docker Deployment
```bash
docker-compose up -d
```

## 🔧 Configuration

Key configuration files:

- `.env`: Environment variables and API keys
- `backend/config/`: Application configuration
- `scripts/`: Setup and deployment scripts

## 📚 API Documentation

### Patient Endpoints
- `POST /api/patient/start-session`: Initialize patient session
- `POST /api/chat/message`: Process patient message
- `GET /api/patient/history`: Retrieve conversation history

### Provider Endpoints
- `GET /api/triage/dashboard`: Triage dashboard data
- `POST /api/knowledge/search`: Search medical knowledge

### Admin Endpoints
- `GET /api/admin/metrics`: System performance metrics
- `GET /api/health`: Health check status

## 🧪 Testing

```bash
# Run backend tests
cd backend
python -m pytest tests/

# Run frontend tests
cd frontend
npm test
```

## 🤝 Contributing

This project is designed for educational purposes as part of the Modern AI Pro Practitioner course. Students should:

1. Fork the repository
2. Customize agents for their specific use case
3. Add new medical knowledge domains
4. Enhance the frontend interface
5. Implement additional security features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Modern AI Pro Practitioner Course
- Google Gemini API for AI capabilities
- ChromaDB for vector database functionality
- Healthcare professionals who provided domain expertise

## 🆘 Support

For technical issues or questions:

1. Check the documentation in `/docs`
2. Review common issues in the troubleshooting guide
3. Contact course instructors for assistance

---

**Built with ❤️ for healthcare AI education and real-world impact**