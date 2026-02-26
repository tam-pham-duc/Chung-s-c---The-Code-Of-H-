'use client';

import React, { useState } from 'react';
import { useGame } from './GameProvider';
import { Question, Answer, Team } from '@/lib/types';
import { Settings, Users, HelpCircle, Play, X, Plus, Trash2, Save, RotateCcw, Eye, Palette, Volume2, Zap, Maximize, Sparkles } from 'lucide-react';

export default function AdminPanel() {
  const {
    gameState,
    revealAnswer,
    addStrike,
    clearStrikes,
    awardPoints,
    nextQuestion,
    prevQuestion,
    updateTeam,
    updateQuestion,
    addQuestion,
    deleteQuestion,
    resetGame,
  } = useGame();

  const [activeTab, setActiveTab] = useState<'control' | 'teams' | 'questions' | 'settings' | 'effects'>('control');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Admin Settings State
  const [adminTheme, setAdminTheme] = useState('blue');
  const [adminFont, setAdminFont] = useState('font-sans');
  const [tabOrder, setTabOrder] = useState(['control', 'teams', 'questions', 'effects', 'settings']);

  // Load settings
  React.useEffect(() => {
    const saved = localStorage.getItem('chungSucAdminSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.adminTheme) setAdminTheme(parsed.adminTheme);
        if (parsed.adminFont) setAdminFont(parsed.adminFont);
        if (parsed.tabOrder) setTabOrder(parsed.tabOrder);
      } catch (e) {}
    }
  }, []);

  // Save settings
  React.useEffect(() => {
    localStorage.setItem('chungSucAdminSettings', JSON.stringify({ adminTheme, adminFont, tabOrder }));
  }, [adminTheme, adminFont, tabOrder]);

  const handleResetConfirm = () => {
    resetGame();
    setShowResetConfirm(false);
  };

  const themeColors: Record<string, string> = {
    blue: 'bg-blue-600 text-blue-600 border-blue-600 hover:bg-blue-700 hover:text-blue-700',
    purple: 'bg-purple-600 text-purple-600 border-purple-600 hover:bg-purple-700 hover:text-purple-700',
    emerald: 'bg-emerald-600 text-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:text-emerald-700',
    rose: 'bg-rose-600 text-rose-600 border-rose-600 hover:bg-rose-700 hover:text-rose-700',
  };

  const getThemeClass = (type: 'bg' | 'text' | 'border') => {
    const classes = themeColors[adminTheme] || themeColors.blue;
    const parts = classes.split(' ');
    return parts.find(p => p.startsWith(type)) || '';
  };

  const tabConfig = {
    control: { id: 'control', label: 'Điều khiển Game', icon: <Play className="w-4 h-4" /> },
    teams: { id: 'teams', label: 'Quản lý Đội chơi', icon: <Users className="w-4 h-4" /> },
    questions: { id: 'questions', label: 'Quản lý Câu hỏi', icon: <HelpCircle className="w-4 h-4" /> },
    effects: { id: 'effects', label: 'Hiệu ứng & Âm thanh', icon: <Sparkles className="w-4 h-4" /> },
    settings: { id: 'settings', label: 'Cài đặt Admin', icon: <Palette className="w-4 h-4" /> },
  };

  return (
    <div className={`min-h-screen bg-gray-100 p-6 ${adminFont}`}>
      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Xác nhận làm mới</h2>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn làm mới toàn bộ dữ liệu trò chơi? Hành động này sẽ khôi phục điểm số, câu hỏi và đội chơi về trạng thái mặc định ban đầu.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleResetConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Đồng ý làm mới
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden flex flex-col h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Bảng Điều Khiển - Chung Sức
          </h1>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Làm mới Game
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
          {tabOrder.map(tabId => {
            const tab = tabConfig[tabId as keyof typeof tabConfig];
            if (!tab) return null;
            const isActive = activeTab === tabId;
            return (
              <button
                key={tabId}
                className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 whitespace-nowrap ${
                  isActive 
                    ? `bg-white border-b-2 ${getThemeClass('border')} ${getThemeClass('text')}` 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tabId as any)}
              >
                {tab.icon} {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'control' && <ControlTab themeColor={getThemeClass('bg')} />}
          {activeTab === 'teams' && <TeamsTab themeColor={getThemeClass('bg')} />}
          {activeTab === 'questions' && <QuestionsTab themeColor={getThemeClass('bg')} />}
          {activeTab === 'effects' && <EffectsTab themeColor={getThemeClass('bg')} />}
          {activeTab === 'settings' && (
            <SettingsTab 
              adminTheme={adminTheme} setAdminTheme={setAdminTheme}
              adminFont={adminFont} setAdminFont={setAdminFont}
              tabOrder={tabOrder} setTabOrder={setTabOrder}
              themeColor={getThemeClass('bg')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ControlTab({ themeColor }: { themeColor: string }) {
  const { gameState, revealAnswer, addStrike, clearStrikes, awardPoints, nextQuestion, prevQuestion } = useGame();
  const { questions, currentQuestionIndex, teams, tempScore, strikes } = gameState;
  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) return <div>Chưa có câu hỏi</div>;

  return (
    <div className="space-y-8">
      {/* Navigation & Status */}
      <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-100">
        <button
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm disabled:opacity-50 hover:bg-gray-50"
        >
          Câu trước
        </button>
        <div className="text-center">
          <div className="text-sm text-gray-500 font-medium">Câu hỏi {currentQuestionIndex + 1} / {questions.length}</div>
          <div className="text-lg font-bold text-blue-900">Vòng {currentQuestion.round} (x{currentQuestion.multiplier})</div>
        </div>
        <button
          onClick={nextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
          className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm disabled:opacity-50 hover:bg-gray-50"
        >
          Câu tiếp
        </button>
      </div>

      {/* Current Question Info */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{currentQuestion.text}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.answers.map((answer, idx) => (
            <div key={answer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full font-bold text-gray-600">
                  {idx + 1}
                </span>
                <span className="font-medium text-gray-800">{answer.text}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-blue-600">{answer.points} đ</span>
                <button
                  onClick={() => revealAnswer(currentQuestion.id, answer.id)}
                  disabled={answer.revealed}
                  className={`px-4 py-1.5 rounded font-medium text-sm transition-colors ${
                    answer.revealed 
                      ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                      : `${themeColor} text-white`
                  }`}
                >
                  {answer.revealed ? 'Đã lật' : 'Lật đáp án'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Game Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strikes */}
        <div className="bg-red-50 p-6 rounded-lg border border-red-100 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-red-800 mb-4">Đánh dấu Sai (Strike)</h3>
          <div className="flex gap-2 mb-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${i < strikes ? 'bg-red-600 border-red-600 text-white' : 'border-red-300 text-transparent'}`}>
                <X className="w-8 h-8" strokeWidth={3} />
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <button onClick={addStrike} className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-sm flex items-center gap-2">
              <X className="w-5 h-5" /> Bấm Sai
            </button>
            <button onClick={clearStrikes} className="px-6 py-2 bg-white text-red-600 border border-red-200 rounded-lg font-bold hover:bg-red-50 shadow-sm">
              Xóa lỗi
            </button>
          </div>
        </div>

        {/* Award Points */}
        <div className="bg-green-50 p-6 rounded-lg border border-green-100 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-green-800 mb-2">Cộng điểm tích lũy</h3>
          <div className="text-4xl font-black text-green-600 mb-6">{tempScore} điểm</div>
          <div className="flex gap-4 w-full">
            <button 
              onClick={() => awardPoints(teams[0].id)}
              disabled={tempScore === 0}
              className={`flex-1 py-3 ${themeColor} text-white rounded-lg font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Cộng cho {teams[0].name}
            </button>
            <button 
              onClick={() => awardPoints(teams[1].id)}
              disabled={tempScore === 0}
              className={`flex-1 py-3 ${themeColor} text-white rounded-lg font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Cộng cho {teams[1].name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamsTab({ themeColor }: { themeColor: string }) {
  const { gameState, updateTeam } = useGame();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {gameState.teams.map((team, index) => (
        <div key={team.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Đội {index + 1}</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên đội</label>
              <input
                type="text"
                value={team.name}
                onChange={(e) => updateTeam(team.id, { name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Điểm số hiện tại</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={team.score}
                  onChange={(e) => updateTeam(team.id, { score: parseInt(e.target.value) || 0 })}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">(Có thể sửa thủ công nếu cần)</span>
              </div>
            </div>

            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Thành viên (4 người)</label>
              {team.members.map((member, mIndex) => (
                <div key={mIndex} className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500 w-24">{mIndex === 0 ? 'Đội trưởng:' : `TV ${mIndex + 1}:`}</span>
                  <input
                    type="text"
                    value={member}
                    onChange={(e) => {
                      const newMembers = [...team.members];
                      newMembers[mIndex] = e.target.value;
                      updateTeam(team.id, { members: newMembers });
                    }}
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuestionsTab({ themeColor }: { themeColor: string }) {
  const { gameState, updateQuestion, addQuestion, deleteQuestion } = useGame();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);

  const handleAddQuestion = () => {
    const newQ: Question = {
      id: `q${Date.now()}`,
      text: 'Câu hỏi mới',
      round: 1,
      multiplier: 1,
      answers: [
        { id: `a${Date.now()}-1`, text: 'Đáp án 1', points: 10, revealed: false }
      ]
    };
    addQuestion(newQ);
    setEditingId(newQ.id);
  };

  return (
    <div className="space-y-6">
      {/* Preview Modal */}
      {previewQuestion && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-950 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative border border-white/20">
            <button 
              onClick={() => setPreviewQuestion(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-8">
              <div className="text-center mb-6">
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                  Xem trước giao diện
                </span>
              </div>
              
              <div className="w-full bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 mb-8 text-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <h3 className="text-2xl md:text-4xl font-bold text-white leading-relaxed drop-shadow-md">
                  {previewQuestion.text}
                </h3>
                <div className="mt-4 text-pink-300 font-medium tracking-wider uppercase text-sm">
                  {previewQuestion.isSuddenDeath ? (
                    <span className="text-rose-400 font-bold animate-pulse">✨ Câu hỏi phụ - Sudden Death ✨</span>
                  ) : (
                    `Vòng ${previewQuestion.round} • Hệ số: x${previewQuestion.multiplier}`
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {previewQuestion.answers.map((answer, idx) => (
                  <div key={answer.id} className="h-16 bg-gradient-to-r from-indigo-800/80 to-purple-800/80 backdrop-blur-sm border border-white/20 rounded-xl flex items-center shadow-lg">
                    <div className="w-12 h-12 ml-2 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-xl font-bold text-white/90 shadow-inner">
                      {idx + 1}
                    </div>
                    <div className="flex-grow px-4 text-white/50 italic text-sm">
                      (Đã ẩn: {answer.text} - {answer.points} điểm)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Danh sách câu hỏi</h2>
        <button
          onClick={handleAddQuestion}
          className={`px-4 py-2 ${themeColor} text-white rounded-lg font-medium flex items-center gap-2`}
        >
          <Plus className="w-4 h-4" /> Thêm câu hỏi
        </button>
      </div>

      <div className="space-y-4">
        {gameState.questions.map((q, index) => (
          <div key={q.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {editingId === q.id ? (
              <QuestionEditor 
                question={q} 
                onSave={(updates) => {
                  updateQuestion(q.id, updates);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
                themeColor={themeColor}
              />
            ) : (
              <div className="p-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">Câu {index + 1}</span>
                    {q.isSuddenDeath ? (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded">Sudden Death</span>
                    ) : (
                      <>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">Vòng {q.round}</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">x{q.multiplier} điểm</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{q.text}</h3>
                  <p className="text-sm text-gray-500 mt-1">{q.answers.length} đáp án</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewQuestion(q)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded flex items-center justify-center"
                    title="Xem trước"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEditingId(q.id)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => {
                      if(confirm('Xóa câu hỏi này?')) deleteQuestion(q.id);
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                    title="Xóa"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function QuestionEditor({ question, onSave, onCancel, themeColor }: { question: Question, onSave: (q: Partial<Question>) => void, onCancel: () => void, themeColor: string }) {
  const [edited, setEdited] = useState<Question>({ ...question });

  const handleAnswerChange = (index: number, field: keyof Answer, value: any) => {
    const newAnswers = [...edited.answers];
    newAnswers[index] = { ...newAnswers[index], [field]: value };
    setEdited({ ...edited, answers: newAnswers });
  };

  const addAnswer = () => {
    setEdited({
      ...edited,
      answers: [...edited.answers, { id: `a${Date.now()}`, text: '', points: 0, revealed: false }]
    });
  };

  const removeAnswer = (index: number) => {
    const newAnswers = [...edited.answers];
    newAnswers.splice(index, 1);
    setEdited({ ...edited, answers: newAnswers });
  };

  return (
    <div className="p-6 bg-blue-50/50">
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung câu hỏi</label>
          <input
            type="text"
            value={edited.text}
            onChange={(e) => setEdited({ ...edited, text: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Vòng thi (1-4)</label>
            <input
              type="number"
              min="1" max="4"
              value={edited.round}
              onChange={(e) => setEdited({ ...edited, round: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={edited.isSuddenDeath}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Hệ số điểm (x1, x2, x3)</label>
            <input
              type="number"
              min="1" max="3"
              value={edited.multiplier}
              onChange={(e) => setEdited({ ...edited, multiplier: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={edited.isSuddenDeath}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="suddenDeath"
            checked={edited.isSuddenDeath || false}
            onChange={(e) => setEdited({ ...edited, isSuddenDeath: e.target.checked })}
            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
          />
          <label htmlFor="suddenDeath" className="text-sm font-bold text-red-600">
            Đánh dấu là Câu hỏi phụ (Sudden Death)
          </label>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Các đáp án</label>
          <button onClick={addAnswer} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
            <Plus className="w-4 h-4" /> Thêm đáp án
          </button>
        </div>
        
        <div className="space-y-2">
          {edited.answers.map((ans, idx) => (
            <div key={ans.id} className="flex items-center gap-2">
              <span className="w-6 text-center text-sm font-medium text-gray-500">{idx + 1}.</span>
              <input
                type="text"
                value={ans.text}
                onChange={(e) => handleAnswerChange(idx, 'text', e.target.value)}
                placeholder="Nội dung đáp án"
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="number"
                value={ans.points}
                onChange={(e) => handleAnswerChange(idx, 'points', parseInt(e.target.value) || 0)}
                placeholder="Điểm"
                className="w-20 px-3 py-1.5 border border-gray-300 rounded-md text-sm"
              />
              <button onClick={() => removeAnswer(idx)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
        <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          Hủy
        </button>
        <button onClick={() => onSave(edited)} className={`px-4 py-2 text-sm font-medium text-white ${themeColor} rounded-md flex items-center gap-2`}>
          <Save className="w-4 h-4" /> Lưu thay đổi
        </button>
      </div>
    </div>
  );
}

function SettingsTab({ 
  adminTheme, setAdminTheme, 
  adminFont, setAdminFont, 
  tabOrder, setTabOrder,
  themeColor
}: { 
  adminTheme: string, setAdminTheme: (v: string) => void,
  adminFont: string, setAdminFont: (v: string) => void,
  tabOrder: string[], setTabOrder: (v: string[]) => void,
  themeColor: string
}) {
  const moveTab = (index: number, direction: -1 | 1) => {
    const newOrder = [...tabOrder];
    const targetIndex = index + direction;
    if (targetIndex >= 0 && targetIndex < newOrder.length) {
      [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
      setTabOrder(newOrder);
    }
  };

  const tabLabels: Record<string, string> = {
    control: 'Điều khiển Game',
    teams: 'Quản lý Đội chơi',
    questions: 'Quản lý Câu hỏi',
    effects: 'Hiệu ứng & Âm thanh',
    settings: 'Cài đặt Admin'
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Tùy chỉnh Giao diện Admin</h2>
        <p className="text-sm text-gray-500 mb-6">Các cài đặt này chỉ áp dụng cho Bảng Điều Khiển của bạn, không ảnh hưởng đến màn hình Game của khán giả.</p>
      </div>

      {/* Theme Color */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Màu sắc chủ đạo</h3>
        <div className="flex gap-4">
          {[
            { id: 'blue', color: 'bg-blue-600', label: 'Xanh dương' },
            { id: 'purple', color: 'bg-purple-600', label: 'Tím' },
            { id: 'emerald', color: 'bg-emerald-600', label: 'Xanh ngọc' },
            { id: 'rose', color: 'bg-rose-600', label: 'Hồng đỏ' },
          ].map(theme => (
            <button
              key={theme.id}
              onClick={() => setAdminTheme(theme.id)}
              className={`flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all ${
                adminTheme === theme.id ? 'border-gray-800 scale-105' : 'border-transparent hover:bg-gray-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-full ${theme.color} shadow-inner`}></div>
              <span className="text-sm font-medium text-gray-700">{theme.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Font Family */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Font chữ</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: 'font-sans', label: 'Mặc định (Sans)', desc: 'Rõ ràng, hiện đại' },
            { id: 'font-serif', label: 'Cổ điển (Serif)', desc: 'Sang trọng, truyền thống' },
            { id: 'font-mono', label: 'Lập trình (Mono)', desc: 'Kỹ thuật, góc cạnh' },
          ].map(font => (
            <button
              key={font.id}
              onClick={() => setAdminFont(font.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${font.id} ${
                adminFont === font.id ? `border-gray-800 bg-gray-50` : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-bold text-gray-900">{font.label}</div>
              <div className="text-xs text-gray-500 mt-1">{font.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Order */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Sắp xếp thứ tự Tab</h3>
        <div className="space-y-2">
          {tabOrder.map((tabId, index) => (
            <div key={tabId} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="font-medium text-gray-700">{index + 1}. {tabLabels[tabId]}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => moveTab(index, -1)}
                  disabled={index === 0}
                  className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded disabled:opacity-30"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveTab(index, 1)}
                  disabled={index === tabOrder.length - 1}
                  className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded disabled:opacity-30"
                >
                  ▼
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EffectsTab({ themeColor }: { themeColor: string }) {
  const { gameState, updateSettings } = useGame();
  const { settings } = gameState;

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Tùy chỉnh Hiệu ứng & Âm thanh</h2>
        <p className="text-sm text-gray-500 mb-6">Các cài đặt này sẽ thay đổi trực tiếp trải nghiệm trên màn hình Game của khán giả.</p>
      </div>

      {/* Question Zoom Settings */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Maximize className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Hiệu ứng Zoom Câu hỏi</h3>
              <p className="text-xs text-gray-500">Phóng to câu hỏi khi mới xuất hiện</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={settings.enableQuestionZoom}
              onChange={(e) => updateSettings({ enableQuestionZoom: e.target.checked })}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Cường độ Zoom: {Math.round(settings.questionZoomIntensity * 100)}%</label>
          <input 
            type="range" 
            min="0" max="1" step="0.1"
            value={settings.questionZoomIntensity}
            onChange={(e) => updateSettings({ questionZoomIntensity: parseFloat(e.target.value) })}
            disabled={!settings.enableQuestionZoom}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-30"
          />
        </div>
      </div>

      {/* Sound Effects Settings */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Hiệu ứng Âm thanh</h3>
              <p className="text-xs text-gray-500">Âm thanh khi lật đáp án hoặc bấm sai</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={settings.enableSoundEffects}
              onChange={(e) => updateSettings({ enableSoundEffects: e.target.checked })}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Âm lượng: {Math.round(settings.soundVolume * 100)}%</label>
          <input 
            type="range" 
            min="0" max="1" step="0.1"
            value={settings.soundVolume}
            onChange={(e) => updateSettings({ soundVolume: parseFloat(e.target.value) })}
            disabled={!settings.enableSoundEffects}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600 disabled:opacity-30"
          />
        </div>
      </div>

      {/* Score Animation Settings */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Hiệu ứng Cập nhật Điểm</h3>
              <p className="text-xs text-gray-500">Số nhảy và zoom khi điểm số thay đổi</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={settings.enableScoreAnimations}
              onChange={(e) => updateSettings({ enableScoreAnimations: e.target.checked })}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
          </label>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Cường độ Hiệu ứng: {Math.round(settings.scoreAnimationIntensity * 100)}%</label>
          <input 
            type="range" 
            min="0" max="1" step="0.1"
            value={settings.scoreAnimationIntensity}
            onChange={(e) => updateSettings({ scoreAnimationIntensity: parseFloat(e.target.value) })}
            disabled={!settings.enableScoreAnimations}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600 disabled:opacity-30"
          />
        </div>
      </div>
    </div>
  );
}
