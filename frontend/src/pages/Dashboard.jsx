import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Folder, 
  Tag, 
  Settings, 
  Search, 
  Plus,
  Edit3,
  Trash2,
  Clock,
  TrendingUp,
  PieChart,
  Star,
  Archive,
  Share2,
  Download,
  Upload,
  Bell,
  Users,
  BarChart3,
  Calendar,
  BookOpen,
  CheckSquare,
  Menu,
  X,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('workspace');
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState(['Work', 'Personal', 'Study']);
  const [tags, setTags] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteForm, setNoteForm] = useState({ title: '', content: '', category: 'Work', tags: [] });
  const [shareEmail, setShareEmail] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [archived, setArchived] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome to NoteSphere!', message: 'Start creating your first note', read: false, timestamp: new Date().toISOString() }
  ]);
  const [settings, setSettings] = useState({
    emailNotifications: false,
    autoSave: true,
    theme: 'light'
  });
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    bio: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [stats, setStats] = useState({
    totalNotes: 0,
    categories: 0,
    lastSync: 0
  });

  // Load user-specific data from localStorage
  useEffect(() => {
    if (user?.email) {
      const userKey = `notesphere_${user.email}`;
      const userData = localStorage.getItem(userKey);
      
      if (userData) {
        const parsed = JSON.parse(userData);
        setNotes(parsed.notes || []);
        setCategories(parsed.categories || ['Work', 'Personal', 'Study']);
        setFavorites(parsed.favorites || []);
        setArchived(parsed.archived || []);
        setNotifications(parsed.notifications || [
          { id: 1, title: 'Welcome to NoteSphere!', message: 'Start creating your first note', read: false, timestamp: new Date().toISOString() }
        ]);
        setSettings(parsed.settings || { emailNotifications: false, autoSave: true, theme: 'light' });
      } else {
        // New user - create welcome note
        const welcomeNote = {
          id: Date.now(),
          title: `Welcome ${user.fullName || user.name || 'User'}!`,
          content: `Hi ${user.fullName || user.name || 'User'},\n\nWelcome to NoteSphere! This is your first note. You can:\n\n• Create new notes\n• Organize with categories\n• Mark favorites with stars\n• Archive old notes\n• Search through all your content\n\nStart building your knowledge base today!`,
          category: 'Personal',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setNotes([welcomeNote]);
        
        const welcomeNotification = {
          id: Date.now() + 1,
          title: `Welcome ${user.fullName || user.name || 'User'}!`,
          message: 'Your NoteSphere account is ready. Start creating notes!',
          read: false,
          timestamp: new Date().toISOString()
        };
        setNotifications([welcomeNotification]);
      }
    }
  }, [user]);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user?.email) {
      const userKey = `notesphere_${user.email}`;
      const userData = {
        notes,
        categories,
        tags,
        favorites,
        archived,
        notifications,
        settings,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(userKey, JSON.stringify(userData));
    }
  }, [user, notes, categories, tags, favorites, archived, notifications, settings]);

  // Update stats based on notes
  useEffect(() => {
    setStats({
      totalNotes: notes.length,
      categories: categories.length,
      lastSync: Math.floor(Math.random() * 5) + 1
    });
  }, [notes, categories]);
  
  // Update profile form when user changes
  useEffect(() => {
    setProfileForm({
      fullName: user?.fullName || user?.name || '',
      email: user?.email || '',
      bio: user?.bio || ''
    });
  }, [user]);
  
  // Update temp settings when settings change
  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  const handleLogout = () => {
    // Save data before logout
    if (user?.email) {
      const userKey = `notesphere_${user.email}`;
      const userData = {
        notes,
        categories,
        favorites,
        archived,
        notifications,
        settings,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(userKey, JSON.stringify(userData));
    }
    logout();
    navigate('/');
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // CRUD Operations
  const createNote = () => {
    if (!noteForm.title.trim()) {
      alert('Please enter a note title');
      return;
    }
    const newNote = {
      id: Date.now(),
      ...noteForm,
      content: noteForm.content || 'New note content...',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user?.email
    };
    setNotes([newNote, ...notes]);
    setNoteForm({ title: '', content: '', category: categories[0] || 'Work' });
    setShowNoteModal(false);
    
    // Add notification for new note
    const newNotification = {
      id: Date.now() + Math.random(),
      title: 'Note Created',
      message: `"${noteForm.title}" has been created successfully`,
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications([newNotification, ...notifications]);
  };

  const updateNote = () => {
    setNotes(notes.map(note => 
      note.id === editingNote.id 
        ? { ...note, ...noteForm, updatedAt: new Date().toISOString() }
        : note
    ));
    setEditingNote(null);
    setNoteForm({ title: '', content: '', category: 'Work' });
    setShowNoteModal(false);
  };

  const deleteNote = (id) => {
    const noteToDelete = notes.find(note => note.id === id);
    setNotes(notes.filter(note => note.id !== id));
    setFavorites(favorites.filter(fav => fav !== id));
    
    // Add notification for deleted note
    if (noteToDelete) {
      const deleteNotification = {
        id: Date.now() + Math.random(),
        title: 'Note Deleted',
        message: `"${noteToDelete.title}" has been deleted`,
        read: false,
        timestamp: new Date().toISOString()
      };
      setNotifications([deleteNotification, ...notifications]);
    }
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setNoteForm({ title: note.title, content: note.content, category: note.category });
    setShowNoteModal(true);
  };

  const openCreateModal = () => {
    setEditingNote(null);
    setNoteForm({ title: '', content: '', category: categories[0] || 'Work', tags: [] });
    setShowNoteModal(true);
  };

  const toggleTagInNote = (tag) => {
    const currentTags = noteForm.tags || [];
    if (currentTags.includes(tag)) {
      setNoteForm({ ...noteForm, tags: currentTags.filter(t => t !== tag) });
    } else {
      setNoteForm({ ...noteForm, tags: [...currentTags, tag] });
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  // Additional CRUD operations
  const toggleFavorite = (noteId) => {
    if (favorites.includes(noteId)) {
      setFavorites(favorites.filter(id => id !== noteId));
    } else {
      setFavorites([...favorites, noteId]);
    }
  };

  const archiveNote = (noteId) => {
    const note = notes.find(n => n.id === noteId);
    setArchived([...archived, note]);
    setNotes(notes.filter(n => n.id !== noteId));
  };

  const unarchiveNote = (noteId) => {
    const note = archived.find(n => n.id === noteId);
    setNotes([...notes, note]);
    setArchived(archived.filter(n => n.id !== noteId));
  };

  const addCategory = () => {
    if (!newCategory.trim()) {
      alert('Please enter a category name');
      return;
    }
    if (categories.includes(newCategory)) {
      alert('Category already exists');
      return;
    }
    setCategories([...categories, newCategory]);
    setNewCategory('');
    setShowCategoryModal(false);
    
    // Add notification for new category
    const categoryNotification = {
      id: Date.now() + Math.random(),
      title: 'Category Created',
      message: `"${newCategory}" category has been added`,
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications([categoryNotification, ...notifications]);
  };

  const addTag = () => {
    if (!newTag.trim()) {
      alert('Please enter a tag name');
      return;
    }
    if (tags.includes(newTag.toLowerCase())) {
      alert('Tag already exists');
      return;
    }
    setTags([...tags, newTag.toLowerCase()]);
    setNewTag('');
    setShowTagModal(false);
    
    // Add notification for new tag
    const tagNotification = {
      id: Date.now() + Math.random(),
      title: 'Tag Created',
      message: `"${newTag}" tag has been added`,
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications([tagNotification, ...notifications]);
  };

  const deleteTag = (tagName) => {
    setTags(tags.filter(tag => tag !== tagName));
    // Remove tag from all notes
    setNotes(notes.map(note => ({
      ...note,
      tags: note.tags ? note.tags.filter(tag => tag !== tagName) : []
    })));
  };

  const getTagNoteCount = (tag) => {
    return notes.filter(note => note.tags && note.tags.includes(tag)).length;
  };

  const shareNote = () => {
    if (!shareEmail.trim()) {
      alert('Please enter an email address');
      return;
    }
    if (!collaborators.includes(shareEmail)) {
      setCollaborators([...collaborators, shareEmail]);
    }
    setShareEmail('');
    setShowShareModal(false);
    
    const shareNotification = {
      id: Date.now() + Math.random(),
      title: 'Collaborator Invited',
      message: `Invitation sent to ${shareEmail}`,
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications([shareNotification, ...notifications]);
  };

  const deleteCategory = (categoryName) => {
    setCategories(categories.filter(cat => cat !== categoryName));
    setNotes(notes.map(note => 
      note.category === categoryName ? { ...note, category: 'Work' } : note
    ));
  };

  const markNotificationRead = (notificationId) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const updateSettings = (newSettings) => {
    setSettings({ ...settings, ...newSettings });
  };
  
  // Calendar functions
  const navigateMonth = (direction) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(calendarDate.getMonth() + direction);
    setCalendarDate(newDate);
  };
  
  const getCalendarDays = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };
  
  // Settings functions
  const saveProfile = () => {
    setIsEditing(false);
    const profileNotification = {
      id: Date.now() + Math.random(),
      title: 'Profile Updated',
      message: 'Your profile has been updated successfully',
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications([profileNotification, ...notifications]);
  };
  
  const saveSettings = () => {
    updateSettings(tempSettings);
    const settingsNotification = {
      id: Date.now() + Math.random(),
      title: 'Settings Saved',
      message: 'Your preferences have been updated',
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications([settingsNotification, ...notifications]);
  };
  
  const resetSettings = () => {
    const defaultSettings = {
      emailNotifications: false,
      autoSave: true,
      theme: 'light'
    };
    setTempSettings(defaultSettings);
    updateSettings(defaultSettings);
  };

  const exportNotes = () => {
    const exportData = {
      notes,
      categories,
      exportedBy: user?.email,
      exportedAt: new Date().toISOString(),
      totalNotes: notes.length
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notesphere-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    // Add notification for export
    const exportNotification = {
      id: Date.now() + Math.random(),
      title: 'Data Exported',
      message: `${notes.length} notes exported successfully`,
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications([exportNotification, ...notifications]);
  };

  const importNotes = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedNotes = JSON.parse(e.target.result);
          const notesWithUserId = importedNotes.map(note => ({
            ...note,
            id: Date.now() + Math.random(),
            userId: user?.email,
            importedAt: new Date().toISOString()
          }));
          setNotes([...notes, ...notesWithUserId]);
          
          // Add notification for import
          const importNotification = {
            id: Date.now() + Math.random(),
            title: 'Notes Imported',
            message: `${importedNotes.length} notes imported successfully`,
            read: false,
            timestamp: new Date().toISOString()
          };
          setNotifications([importNotification, ...notifications]);
        } catch (error) {
          alert('Invalid file format. Please select a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const favoriteNotes = notes.filter(note => favorites.includes(note.id));
  const getCategoryNoteCount = (category) => notes.filter(note => note.category === category).length;

  const sidebarItems = [
    { id: 'workspace', label: 'Home', icon: LayoutDashboard, description: 'Your main workspace' },
    { id: 'notes', label: 'All Pages', icon: FileText, description: `${notes.length} pages` },
    { id: 'templates', label: 'Templates', icon: BookOpen, description: 'Quick start templates' },
    { id: 'favorites', label: 'Favorites', icon: Star, description: `${favorites.length} starred` },
    { id: 'recent', label: 'Recent', icon: Clock, description: 'Recently edited' },
    { id: 'shared', label: 'Shared', icon: Users, description: 'Collaborative pages' },
    { id: 'trash', label: 'Trash', icon: Trash2, description: 'Deleted pages' },
  ];
  
  const templates = [
    { id: 'blank', name: 'Blank Page', icon: FileText, color: 'from-slate-400 to-slate-500', description: 'Start with an empty page' },
    { id: 'meeting', name: 'Meeting Notes', icon: Users, color: 'from-blue-500 to-indigo-600', description: 'Template for meeting notes' },
    { id: 'lecture', name: 'Lecture Notes', icon: BookOpen, color: 'from-emerald-500 to-teal-600', description: 'Perfect for class notes' },
    { id: 'project', name: 'Project Plan', icon: Calendar, color: 'from-purple-500 to-violet-600', description: 'Organize your projects' },
    { id: 'journal', name: 'Daily Journal', icon: Edit3, color: 'from-orange-500 to-red-500', description: 'Daily reflection template' },
    { id: 'research', name: 'Research Notes', icon: Search, color: 'from-cyan-500 to-blue-600', description: 'Academic research template' },
    { id: 'todo', name: 'To-Do List', icon: CheckSquare, color: 'from-green-500 to-emerald-600', description: 'Task management template' },
    { id: 'study', name: 'Study Guide', icon: Star, color: 'from-yellow-500 to-amber-600', description: 'Study and revision notes' }
  ];

  const chartData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 40) + 10);

  const renderContent = () => {
    switch (activeTab) {
      case 'workspace':
        return (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.fullName?.split(' ')[0] || user?.name || 'Student'}! 👋</h1>
                  <p className="text-gray-600 mt-1">Ready to organize your thoughts and ideas?</p>
                </div>
                <button 
                  onClick={openCreateModal}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Page</span>
                </button>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">📝</div>
                    <div>
                      <p className="text-sm font-medium text-blue-800">Total Pages</p>
                      <p className="text-xl font-bold text-blue-900">{notes.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">⭐</div>
                    <div>
                      <p className="text-sm font-medium text-purple-800">Favorites</p>
                      <p className="text-xl font-bold text-purple-900">{favorites.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">📚</div>
                    <div>
                      <p className="text-sm font-medium text-green-800">Categories</p>
                      <p className="text-xl font-bold text-green-900">{categories.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🕒</div>
                    <div>
                      <p className="text-sm font-medium text-orange-800">Today</p>
                      <p className="text-xl font-bold text-orange-900">{notes.filter(note => new Date(note.createdAt).toDateString() === new Date().toDateString()).length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Notes</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Edited</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {notes.slice(0, 5).map((note) => (
                      <tr key={note.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{note.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            note.category === 'Work' ? 'bg-blue-100 text-blue-800' :
                            note.category === 'Personal' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {note.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getTimeAgo(note.updatedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => toggleFavorite(note.id)}
                              className={`${favorites.includes(note.id) ? 'text-yellow-600' : 'text-gray-400'} hover:text-yellow-600`}
                            >
                              <Star className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => openEditModal(note)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => archiveNote(note.id)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteNote(note.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Notes Created Over Time</h3>
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
                <div className="h-64 flex items-end justify-between bg-gradient-to-t from-blue-50 to-white rounded-lg p-4 relative">
                  {Array.from({ length: 12 }, (_, index) => {
                    const monthNotes = notes.filter(note => {
                      const noteMonth = new Date(note.createdAt).getMonth();
                      return noteMonth === index;
                    }).length;
                    const maxHeight = Math.max(...Array.from({ length: 12 }, (_, i) => 
                      notes.filter(note => new Date(note.createdAt).getMonth() === i).length
                    ), 1);
                    const height = (monthNotes / maxHeight) * 200;
                    return (
                      <div key={index} className="flex flex-col items-center group relative">
                        <div className="absolute -top-8 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          {monthNotes} notes
                        </div>
                        <div 
                          className="w-6 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-500 hover:from-blue-700 hover:to-blue-500 cursor-pointer"
                          style={{ height: `${Math.max(height, 8)}px` }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-2">
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Notes by Category</h3>
                  <PieChart className="w-5 h-5 text-gray-400" />
                </div>
                <div className="h-64 flex items-center justify-center">
                  <div className="relative w-40 h-40">
                    {(() => {
                      const categoryStats = categories.map(cat => ({
                        name: cat,
                        count: getCategoryNoteCount(cat),
                        percentage: notes.length > 0 ? (getCategoryNoteCount(cat) / notes.length * 100) : 0
                      }));
                      let cumulativePercentage = 0;
                      const colors = ['#3b82f6', '#c084fc', '#10b981', '#f59e0b', '#ef4444'];
                      return (
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="20"/>
                          {categoryStats.map((cat, index) => {
                            const strokeDasharray = (cat.percentage / 100) * 251.2;
                            const strokeDashoffset = -cumulativePercentage * 2.512;
                            cumulativePercentage += cat.percentage;
                            return cat.count > 0 ? (
                              <circle 
                                key={cat.name}
                                cx="50" 
                                cy="50" 
                                r="40" 
                                fill="none" 
                                stroke={colors[index] || '#6b7280'} 
                                strokeWidth="20"
                                strokeDasharray={`${strokeDasharray} 251.2`}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-300 hover:stroke-opacity-80"
                              />
                            ) : null;
                          })}
                        </svg>
                      );
                    })()}
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {categories.map((category, index) => {
                    const count = getCategoryNoteCount(category);
                    const percentage = notes.length > 0 ? Math.round((count / notes.length) * 100) : 0;
                    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'];
                    return count > 0 ? (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 ${colors[index] || 'bg-gray-500'} rounded-full`}></div>
                          <span className="text-sm text-gray-600">{category}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </>
        );
      case 'notes':
        return (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">All Pages</h2>
                  <p className="text-sm text-gray-600">{notes.length} pages in your workspace</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setActiveTab('templates')}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-1"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Templates</span>
                  </button>
                  <button 
                    onClick={openCreateModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Page</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              {notes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No pages yet</h3>
                  <p className="text-gray-600 mb-6">Create your first page to get started with organizing your thoughts</p>
                  <div className="flex justify-center space-x-3">
                    <button 
                      onClick={openCreateModal}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Page</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('templates')}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Browse Templates</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {(searchTerm ? filteredNotes : notes).map((note) => (
                    <div key={note.id} className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
                         onClick={() => openEditModal(note)}>
                      <div className="text-lg">📄</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{note.title}</h3>
                        <p className="text-sm text-gray-600 truncate">{note.content.substring(0, 100)}...</p>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          note.category === 'Work' ? 'bg-blue-100 text-blue-800' :
                          note.category === 'Personal' ? 'bg-purple-100 text-purple-800' :
                          note.category === 'Study' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {note.category}
                        </span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(note.id); }}
                          className={`p-1 rounded ${favorites.includes(note.id) ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-600'}`}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                          className="p-1 rounded text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        {getTimeAgo(note.updatedAt)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'favorites':
        return (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Favorite Notes</h2>
            </div>
            <div className="p-6">
              {favoriteNotes.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No favorite notes yet</p>
                  <p className="text-sm text-gray-400">Star notes to add them to your favorites</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteNotes.map((note) => (
                    <div key={note.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 flex-1">{note.title}</h3>
                        <Star className="w-4 h-4 text-yellow-500 ml-2" />
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{note.content}</p>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          note.category === 'Work' ? 'bg-blue-100 text-blue-800' :
                          note.category === 'Personal' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {note.category}
                        </span>
                        <span className="text-xs text-gray-500">{getTimeAgo(note.updatedAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'categories':
        return (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
                <p className="text-sm text-gray-600 mt-1">Organize your pages by subject or topic</p>
              </div>
              <button 
                onClick={() => setShowCategoryModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Category</span>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map((category, index) => (
                  <div key={category} className="border border-gray-200 rounded-lg p-6 text-center relative group">
                    <button 
                      onClick={() => deleteCategory(category)}
                      className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className={`w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center ${
                      index === 0 ? 'bg-blue-100' :
                      index === 1 ? 'bg-purple-100' :
                      index === 2 ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Folder className={`w-6 h-6 ${
                        index === 0 ? 'text-blue-600' :
                        index === 1 ? 'text-purple-600' :
                        index === 2 ? 'text-green-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <h3 className="font-semibold text-gray-900">{category}</h3>
                    <p className="text-sm text-gray-600">{getCategoryNoteCount(category)} notes</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'tags':
        return (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Tags</h2>
              <button 
                onClick={() => setShowTagModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
              >
                <Tag className="w-4 h-4" />
                <span>Add Tag</span>
              </button>
            </div>
            <div className="p-6">
              {tags.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Tag className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tags Yet</h3>
                  <p className="text-gray-500 mb-4">Create tags to organize your notes better</p>
                  <button 
                    onClick={() => setShowTagModal(true)}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Create Your First Tag
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search tags..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">All Tags ({tags.length})</h3>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => {
                          const colors = ['bg-blue-100 text-blue-800 hover:bg-blue-200', 'bg-purple-100 text-purple-800 hover:bg-purple-200', 'bg-green-100 text-green-800 hover:bg-green-200', 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200', 'bg-red-100 text-red-800 hover:bg-red-200', 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'];
                          return (
                            <div key={tag} className="group relative">
                              <span 
                                className={`px-3 py-2 ${colors[index % colors.length]} rounded-full text-sm cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md flex items-center space-x-1`}
                                onClick={() => setSearchTerm(`#${tag}`)}
                              >
                                <Tag className="w-3 h-3" />
                                <span>#{tag}</span>
                              </span>
                              <button 
                                onClick={() => deleteTag(tag)}
                                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Tag Analytics</h3>
                      <div className="space-y-3">
                        {tags.slice(0, 5).map((tag, index) => {
                          const count = getTagNoteCount(tag);
                          const percentage = notes.length > 0 ? Math.round((count / notes.length) * 100) : 0;
                          return (
                            <div key={tag} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">#{tag}</span>
                                <span className="text-xs text-gray-500">{count} notes</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.max(percentage, 5)}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      case 'shared':
        return (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Shared Notes</h2>
              <button 
                onClick={() => setShowShareModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Invite Collaborator</span>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Collaborators</p>
                      <p className="text-2xl font-bold text-gray-900">{collaborators.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Share2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Shared Notes</p>
                      <p className="text-2xl font-bold text-gray-900">{sharedNotes.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Bell className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                      <p className="text-2xl font-bold text-gray-900">{Math.floor(Math.random() * 3)}</p>
                    </div>
                  </div>
                </div>
              </div>
              {collaborators.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Collaborating</h3>
                  <p className="text-gray-500 mb-4">Invite team members to collaborate on your notes</p>
                  <button 
                    onClick={() => setShowShareModal(true)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Invite Your First Collaborator</span>
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Collaborators ({collaborators.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {collaborators.map((email, index) => (
                      <div key={email} className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {email.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{email}</p>
                          <p className="text-xs text-gray-500">Invited • Can edit</p>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'recent':
        const recentNotes = notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 10);
        return (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Pages</h2>
              <p className="text-sm text-gray-600 mt-1">Your recently edited pages</p>
            </div>
            <div className="p-6">
              {recentNotes.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentNotes.map((note) => (
                    <div key={note.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                         onClick={() => openEditModal(note)}>
                      <div className="text-lg">📄</div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{note.title}</h3>
                        <p className="text-sm text-gray-600">Last edited {getTimeAgo(note.updatedAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'trash':
        return (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Trash</h2>
              <p className="text-sm text-gray-600 mt-1">Deleted pages are kept here for 30 days</p>
            </div>
            <div className="p-6">
              {archived.length === 0 ? (
                <div className="text-center py-8">
                  <Trash2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Trash is empty</p>
                  <p className="text-sm text-gray-400">Deleted pages will appear here</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {archived.map((note) => (
                    <div key={note.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-200">
                      <div className="text-lg opacity-50">📄</div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-700">{note.title}</h3>
                        <p className="text-sm text-gray-500">Deleted {getTimeAgo(note.updatedAt)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => unarchiveNote(note.id)}
                          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                        >
                          Restore
                        </button>
                        <button 
                          onClick={() => setArchived(archived.filter(n => n.id !== note.id))}
                          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                        >
                          Delete Forever
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'calendar':

        
        return (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Calendar</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setViewMode('month')}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    viewMode === 'month' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Month
                </button>
                <button 
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    viewMode === 'week' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Week
                </button>
                <button 
                  onClick={() => setViewMode('day')}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    viewMode === 'day' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Day
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => navigateMonth(-1)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => setCalendarDate(new Date())}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      Today
                    </button>
                    <button 
                      onClick={() => navigateMonth(1)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {getCalendarDays().map((date, i) => {
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isCurrentMonth = date.getMonth() === calendarDate.getMonth();
                    const dayNotes = notes.filter(note => new Date(note.createdAt).toDateString() === date.toDateString());
                    const hasNotes = dayNotes.length > 0;
                    
                    return (
                      <div 
                        key={i} 
                        className={`p-2 text-center text-sm cursor-pointer rounded-lg transition-all duration-200 relative group ${
                          isToday ? 'bg-blue-600 text-white shadow-md' : 
                          hasNotes ? 'bg-green-100 text-green-800 hover:bg-green-200 hover:shadow-sm' :
                          isCurrentMonth ? 'hover:bg-gray-100 text-gray-900' : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          if (hasNotes) {
                            setSearchTerm(date.toLocaleDateString());
                            setActiveTab('notes');
                          } else {
                            setNoteForm({ 
                              title: `Note for ${date.toLocaleDateString()}`, 
                              content: '', 
                              category: categories[0] || 'Work', 
                              tags: [] 
                            });
                            setShowNoteModal(true);
                          }
                        }}
                      >
                        {date.getDate()}
                        {hasNotes && (
                          <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                        {hasNotes && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {dayNotes.length} note{dayNotes.length > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Today's Activity</h4>
                <div className="space-y-2">
                  {notes.filter(note => new Date(note.createdAt).toDateString() === new Date().toDateString()).length > 0 ? (
                    notes.filter(note => new Date(note.createdAt).toDateString() === new Date().toDateString()).map(note => (
                      <div key={note.id} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                           onClick={() => openEditModal(note)}>
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700 flex-1">{note.title}</span>
                        <span className="text-xs text-gray-500">{note.category}</span>
                        <Edit3 className="w-3 h-3 text-gray-400" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 mb-2">No notes created today</p>
                      <button 
                        onClick={openCreateModal}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Create your first note today
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Notes</p>
                    <p className="text-3xl font-bold">{notes.length}</p>
                    <p className="text-blue-100 text-xs mt-1">+{notes.filter(note => new Date(note.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length} this week</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Favorites</p>
                    <p className="text-3xl font-bold">{favorites.length}</p>
                    <p className="text-purple-100 text-xs mt-1">{notes.length > 0 ? Math.round((favorites.length / notes.length) * 100) : 0}% of total</p>
                  </div>
                  <Star className="w-8 h-8 text-purple-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Categories</p>
                    <p className="text-3xl font-bold">{categories.length}</p>
                    <p className="text-green-100 text-xs mt-1">Active categories</p>
                  </div>
                  <Folder className="w-8 h-8 text-green-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Tags</p>
                    <p className="text-3xl font-bold">{tags.length}</p>
                    <p className="text-orange-100 text-xs mt-1">Organization tags</p>
                  </div>
                  <Tag className="w-8 h-8 text-orange-200" />
                </div>
              </div>
            </div>
            {notes.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BarChart3 className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Data Yet</h3>
                  <p className="text-gray-500 mb-4">Create some notes to see your productivity insights</p>
                  <button 
                    onClick={openCreateModal}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Your First Note
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Notes Created Over Time</h3>
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="h-64 flex items-end justify-between bg-gradient-to-t from-blue-50 to-white rounded-lg p-4 relative">
                    {Array.from({ length: 12 }, (_, index) => {
                      const monthNotes = notes.filter(note => {
                        const noteMonth = new Date(note.createdAt).getMonth();
                        return noteMonth === index;
                      }).length;
                      const allMonthCounts = Array.from({ length: 12 }, (_, i) => 
                        notes.filter(note => new Date(note.createdAt).getMonth() === i).length
                      );
                      const maxHeight = Math.max(...allMonthCounts, 1);
                      const height = notes.length === 0 ? 8 : Math.max((monthNotes / maxHeight) * 200, 4);
                      return (
                        <div key={index} className="flex flex-col items-center group relative">
                          <div className="absolute -top-8 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            {monthNotes} notes
                          </div>
                          <div 
                            className={`w-6 rounded-t transition-all duration-500 cursor-pointer ${
                              monthNotes === 0 ? 'bg-gray-200' : 'bg-gradient-to-t from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500'
                            }`}
                            style={{ height: `${height}px` }}
                          ></div>
                          <span className="text-xs text-gray-500 mt-2">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Category Distribution</h3>
                    <PieChart className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="h-64 flex items-center justify-center">
                    <div className="relative w-40 h-40">
                      {(() => {
                        const categoryStats = categories.map(cat => ({
                          name: cat,
                          count: getCategoryNoteCount(cat),
                          percentage: notes.length > 0 ? (getCategoryNoteCount(cat) / notes.length * 100) : 0
                        }));
                        let cumulativePercentage = 0;
                        const colors = ['#3b82f6', '#c084fc', '#10b981', '#f59e0b', '#ef4444'];
                        return (
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="20"/>
                            {notes.length === 0 ? (
                              <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                fill="none" 
                                stroke="#e5e7eb" 
                                strokeWidth="20"
                              />
                            ) : (
                              categoryStats.map((cat, index) => {
                                const strokeDasharray = (cat.percentage / 100) * 251.2;
                                const strokeDashoffset = -cumulativePercentage * 2.512;
                                cumulativePercentage += cat.percentage;
                                return cat.count > 0 ? (
                                  <circle 
                                    key={cat.name}
                                    cx="50" 
                                    cy="50" 
                                    r="40" 
                                    fill="none" 
                                    stroke={colors[index] || '#6b7280'} 
                                    strokeWidth="20"
                                    strokeDasharray={`${strokeDasharray} 251.2`}
                                    strokeDashoffset={strokeDashoffset}
                                    className="transition-all duration-300 hover:stroke-opacity-80"
                                  />
                                ) : null;
                              })
                            )}
                          </svg>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {notes.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500">No data to display</p>
                        <p className="text-xs text-gray-400">Create notes to see category distribution</p>
                      </div>
                    ) : (
                      categories.map((category, index) => {
                        const count = getCategoryNoteCount(category);
                        const percentage = notes.length > 0 ? Math.round((count / notes.length) * 100) : 0;
                        const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'];
                        return count > 0 ? (
                          <div key={category} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 ${colors[index] || 'bg-gray-500'} rounded-full`}></div>
                              <span className="text-sm text-gray-600">{category}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                          </div>
                        ) : null;
                      })
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'templates':
        const createFromTemplate = (template) => {
          const templateContent = {
            blank: '',
            meeting: `# Meeting Notes\n\n**Date:** ${new Date().toLocaleDateString()}\n**Attendees:** \n\n## Agenda\n- \n\n## Discussion\n\n## Action Items\n- [ ] \n\n## Next Steps\n`,
            lecture: `# Lecture Notes\n\n**Course:** \n**Date:** ${new Date().toLocaleDateString()}\n**Topic:** \n\n## Key Points\n\n## Important Concepts\n\n## Questions\n\n## Summary\n`,
            project: `# Project Plan\n\n**Project:** \n**Due Date:** \n**Status:** Planning\n\n## Objectives\n\n## Tasks\n- [ ] \n\n## Resources\n\n## Timeline\n`,
            journal: `# Daily Journal\n\n**Date:** ${new Date().toLocaleDateString()}\n\n## Today's Highlights\n\n## Thoughts & Reflections\n\n## Tomorrow's Goals\n- [ ] \n`,
            research: `# Research Notes\n\n**Topic:** \n**Date:** ${new Date().toLocaleDateString()}\n\n## Research Question\n\n## Sources\n\n## Key Findings\n\n## Analysis\n\n## Conclusion\n`,
            todo: `# To-Do List\n\n**Date:** ${new Date().toLocaleDateString()}\n\n## Priority Tasks\n- [ ] \n\n## Other Tasks\n- [ ] \n\n## Completed\n- [x] \n`,
            study: `# Study Guide\n\n**Subject:** \n**Exam Date:** \n\n## Key Topics\n\n## Important Formulas\n\n## Practice Questions\n\n## Review Notes\n`
          };
          
          setNoteForm({
            title: template.name,
            content: templateContent[template.id] || '',
            category: categories[0] || 'Study',
            tags: []
          });
          setShowNoteModal(true);
        };
        
        return (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Templates</h2>
                  <p className="text-sm text-gray-600 mt-1">Start with a template to organize your thoughts</p>
                </div>
                <button 
                  onClick={() => createFromTemplate(templates[0])}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {templates.map((template) => (
                  <div 
                    key={template.id} 
                    onClick={() => createFromTemplate(template)}
                    className="group border-0 rounded-xl p-5 hover:shadow-xl transition-all cursor-pointer bg-white hover:scale-105 duration-300 shadow-md"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${template.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
                      <template.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-sm">{template.name}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">{template.description}</p>
                    <div className="flex items-center text-gray-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-3 h-3 mr-1" />
                      <span>Create from template</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer ${
                      notification.read ? 'bg-gray-50' : 'bg-blue-50'
                    }`}
                    onClick={() => markNotificationRead(notification.id)}
                  >
                    <Bell className={`w-5 h-5 mt-0.5 ${
                      notification.read ? 'text-gray-400' : 'text-blue-600'
                    }`} />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        notification.read ? 'text-gray-600' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{getTimeAgo(notification.timestamp)}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'settings':

        
        return (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
            </div>
            <div className="p-6 space-y-8">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Profile Settings</h3>
                  <button
                    onClick={() => isEditing ? saveProfile() : setIsEditing(true)}
                    className={`px-4 py-2 text-sm rounded-lg ${
                      isEditing ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                      readOnly={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                        isEditing ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={profileForm.email}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                      readOnly={!isEditing}
                      rows={3}
                      placeholder="Tell us about yourself..."
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                        isEditing ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'bg-gray-50'
                      }`}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={resetSettings}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Reset
                    </button>
                    <button
                      onClick={saveSettings}
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800">Notifications</h4>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Email notifications</span>
                        <p className="text-xs text-gray-500">Receive updates via email</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={tempSettings.emailNotifications}
                        onChange={(e) => setTempSettings({...tempSettings, emailNotifications: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Auto-save notes</span>
                        <p className="text-xs text-gray-500">Automatically save changes</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={tempSettings.autoSave}
                        onChange={(e) => setTempSettings({...tempSettings, autoSave: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                      />
                    </label>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800">Appearance</h4>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                      <select
                        value={tempSettings.theme}
                        onChange={(e) => setTempSettings({...tempSettings, theme: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={exportNotes}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Notes ({notes.length})</span>
                  </button>
                  <label className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Import Notes</span>
                    <input 
                      type="file" 
                      accept=".json"
                      onChange={importNotes}
                      className="hidden" 
                    />
                  </label>
                </div>
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">Data Privacy</h4>
                      <p className="text-xs text-yellow-700 mt-1">
                        Your data is stored locally in your browser. Export regularly to backup your notes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <Menu className="w-5 h-5" />
      </button>
      
      {/* Mobile Overlay */}
      {showMobileMenu && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
      
      {/* Left Sidebar */}
      <div className={`w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm transition-transform duration-300 ${
        showMobileMenu ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:relative z-40 h-full lg:h-auto`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">NoteSphere</h1>
              <p className="text-xs text-gray-500">Study • Create • Organize</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-800">Hey {(user?.fullName || user?.name || 'Student').split(' ')[0]}!</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Ready to capture your ideas and organize your studies?
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="mb-6">
            <button 
              onClick={() => {
                openCreateModal();
                setShowMobileMenu(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">New Page</span>
            </button>
          </div>
          
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setShowMobileMenu(false);
                    }}
                    className={`group w-full flex items-center justify-between px-3 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <div>
                        <span className="text-sm font-medium block">{item.label}</span>
                        <span className="text-xs text-gray-500 group-hover:text-gray-600">{item.description}</span>
                      </div>
                    </div>
                    {activeTab === item.id && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          
          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
              <div className="flex items-center space-x-2 mb-2">
                <Bell className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-800">Quick Tip</span>
              </div>
              <p className="text-xs text-green-700 leading-relaxed">
                Use templates to get started quickly with structured notes!
              </p>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-lg ml-12 lg:ml-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            {/* Actions & Profile */}
            <div className="flex items-center space-x-2 lg:space-x-3">
              <button 
                onClick={openCreateModal}
                className="flex items-center space-x-2 px-2 lg:px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {(user?.fullName || user?.name || 'Student').split(' ')[0]}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 flex flex-col xl:flex-row">
          {/* Main Dashboard */}
          <main className="flex-1 p-4 lg:p-6">
            {renderContent()}
          </main>

          {/* Right Sidebar - Notion Style */}
          <aside className="w-full xl:w-72 bg-gray-50 border-t xl:border-t-0 xl:border-l border-gray-200 p-4">
            <div className="space-y-6">
              {/* Quick Templates */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Quick Start
                </h3>
                <div className="grid grid-cols-2 xl:grid-cols-1 gap-2">
                  {templates.slice(0, 4).map((template) => (
                    <button 
                      key={template.id}
                      onClick={() => {
                        const templateContent = {
                          blank: '',
                          meeting: `# Meeting Notes\n\n**Date:** ${new Date().toLocaleDateString()}\n**Attendees:** \n\n## Agenda\n- \n\n## Discussion\n\n## Action Items\n- [ ] \n`,
                          lecture: `# Lecture Notes\n\n**Course:** \n**Date:** ${new Date().toLocaleDateString()}\n**Topic:** \n\n## Key Points\n\n## Important Concepts\n`,
                          project: `# Project Plan\n\n**Project:** \n**Due Date:** \n\n## Objectives\n\n## Tasks\n- [ ] \n`
                        };
                        setNoteForm({
                          title: template.name,
                          content: templateContent[template.id] || '',
                          category: categories[0] || 'Study',
                          tags: []
                        });
                        setShowNoteModal(true);
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg hover:bg-white hover:shadow-sm transition-all text-sm border border-transparent hover:border-gray-200"
                    >
                      <div className={`w-8 h-8 bg-gradient-to-br ${template.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <template.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-700 truncate">{template.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Recent Activity */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Recent
                </h3>
                <div className="space-y-1">
                  {notes.slice(0, 5).map((note) => (
                    <button 
                      key={note.id}
                      onClick={() => {
                        openEditModal(note);
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-left rounded-lg hover:bg-white hover:shadow-sm transition-all text-sm border border-transparent hover:border-gray-200"
                    >
                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="font-medium text-gray-700 truncate flex-1">{note.title}</span>
                    </button>
                  ))}
                  {notes.length === 0 && (
                    <p className="text-xs text-gray-500 px-3 py-2">No recent pages</p>
                  )}
                </div>
              </div>
              
              {/* Categories */}
              <div className="hidden xl:block">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <Folder className="w-4 h-4 mr-2" />
                  Categories
                </h3>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white transition-all">
                      <span className="text-sm text-gray-700">{category}</span>
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                        {getCategoryNoteCount(category)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 px-6 py-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>💾 Auto-saved locally</span>
              <span>•</span>
              <span>{notes.length} pages</span>
            </div>
            <span>© 2025 NoteSphere - Your Digital Workspace</span>
          </div>
        </footer>
      </div>

      {/* Note Modal - Notion Style */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">📄</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingNote ? 'Edit Page' : 'New Page'}
                  </h3>
                  <p className="text-sm text-gray-600">Start writing and use "/" for commands</p>
                </div>
              </div>
              <button
                onClick={() => setShowNoteModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <input
                    type="text"
                    value={noteForm.title}
                    onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
                    className="w-full text-3xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none resize-none"
                    placeholder="Untitled"
                    style={{ background: 'transparent' }}
                  />
                </div>
                
                {/* Metadata */}
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Folder className="w-4 h-4" />
                    <select
                      value={noteForm.category}
                      onChange={(e) => setNoteForm({...noteForm, category: e.target.value})}
                      className="border-none outline-none bg-transparent cursor-pointer hover:bg-gray-100 rounded px-2 py-1"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="text-gray-400">•</div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
                
                {/* Content Editor */}
                <div className="min-h-[400px]">
                  <textarea
                    value={noteForm.content}
                    onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                    className="w-full h-full min-h-[400px] text-gray-900 placeholder-gray-400 border-none outline-none resize-none text-base leading-relaxed"
                    placeholder="Start writing... Use markdown for formatting:\n\n# Heading 1\n## Heading 2\n**Bold text**\n*Italic text*\n- Bullet point\n1. Numbered list\n[ ] Todo item"
                    style={{ background: 'transparent', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
                  />
                </div>
                
                {/* Tags */}
                {tags.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Tag className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTagInNote(tag)}
                          className={`px-3 py-1 text-sm rounded-full transition-all hover:scale-105 ${
                            (noteForm.tags || []).includes(tag)
                              ? 'bg-blue-100 text-blue-800 border border-blue-300 shadow-sm'
                              : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Auto-saved</span>
                </div>
                <div>{noteForm.content.length} characters</div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingNote ? updateNote : createNote}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <span>{editingNote ? 'Update Page' : 'Create Page'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Category</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category name"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addCategory}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tag Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Tag</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tag Name</label>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter tag name (e.g., javascript, meeting)"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowTagModal(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addTag}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite Collaborator</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="colleague@example.com"
                />
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  📝 Collaborators will be able to view and edit shared notes in real-time
                </p>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={shareNote}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;