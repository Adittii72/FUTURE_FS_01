import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FolderKanban, Award, MessageSquare, Code, FileText } from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import ManageResumeModal from '../components/admin/ManageResumeModal';

const Dashboard = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    achievements: 0,
    unreadMessages: 0,
  });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [isLoggedIn, navigate]);

  const fetchData = async () => {
    try {
      const [statsRes, messagesRes] = await Promise.all([
        api.get('/analytics/summary'),
        api.get('/contact/messages'),
      ]);
      setStats(statsRes.data);
      setMessages(messagesRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await api.delete(`/contact/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Failed to delete message');
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    );
  }

  const statCards = [
    { icon: FolderKanban, label: 'Projects', value: stats.projects, color: 'from-blue-500 to-cyan-500' },
    { icon: Code, label: 'Skills', value: stats.skills, color: 'from-purple-500 to-pink-500' },
    { icon: Award, label: 'Achievements', value: stats.achievements, color: 'from-yellow-500 to-orange-500' },
    { icon: MessageSquare, label: 'Unread Messages', value: stats.unreadMessages, color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <section className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold gradient-text mb-12">Dashboard</h1>

        {/* Resume Management */}
        <Card className="mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <div>
                <h3 className="font-semibold">Resume Management</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Update your resume download link</p>
              </div>
            </div>
            <Button variant="primary" onClick={() => setIsResumeModalOpen(true)}>
              Manage Resume
            </Button>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, idx) => (
            <Card key={idx} className="relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-16 -mt-16`}></div>
              <div className="relative">
                <div className={`inline-flex p-3 bg-gradient-to-br ${stat.color} rounded-lg mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Messages Section */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">Contact Messages</h2>
          {messages.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No messages yet.</p>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{message.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{message.email}</p>
                      {message.phone && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{message.phone}</p>
                      )}
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteMessage(message._id)}
                    >
                      Delete
                    </Button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">{message.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <ManageResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onUpdate={() => {
          setIsResumeModalOpen(false);
          // Optionally refresh data
        }}
      />
    </section>
  );
};

export default Dashboard;

