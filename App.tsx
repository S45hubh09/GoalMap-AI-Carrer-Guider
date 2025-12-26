import React, { useState, useRef } from 'react';
import { Compass, GraduationCap, Loader2, BookOpen, AlertCircle, Upload, X, Camera, MapPin, Building2, Wallet } from 'lucide-react';
import InputField from './components/InputField';
import SelectField from './components/SelectField';
import ReportView from './components/ReportView';
import { AcademicLevel, LearningStyle, StudentProfile } from './types';
import { generateCareerGuidance } from './services/geminiService';

const BUDGET_RANGES = [
  "< ₹1 Lakh / Year",
  "₹1 - 3 Lakhs / Year",
  "₹3 - 6 Lakhs / Year",
  "₹6 - 10 Lakhs / Year",
  "> ₹10 Lakhs / Year"
];

const App: React.FC = () => {
  // --- MAIN APP STATE ---
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Slider state index (0 to 4)
  const [budgetIndex, setBudgetIndex] = useState(1);

  const [formData, setFormData] = useState<StudentProfile>({
    name: '',
    level: AcademicLevel.Class10,
    stream: '',
    interests: '',
    strengths: '',
    limitations: '',
    academicResults: '',
    academicResultImage: undefined,
    budgetRange: BUDGET_RANGES[1], // Default to index 1
    location: '',
    collegeType: '',
    learningStyle: LearningStyle.Mixed
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- FORM HANDLERS ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value);
    setBudgetIndex(idx);
    setFormData(prev => ({ ...prev, budgetRange: BUDGET_RANGES[idx] }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size too large. Please upload an image under 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, academicResultImage: reader.result as string }));
        setError(null);
      };
      reader.onerror = () => {
        setError("Failed to read the file. Please try again.");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, academicResultImage: undefined }));
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const guidance = await generateCareerGuidance(formData);
      setResult(guidance);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  // --- RENDER HELPERS ---
  
  // Background (Shared)
  const Background = () => (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Strong White Source Light (Top Left) */}
        <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-white/20 rounded-full blur-[150px] mix-blend-overlay animate-blob"></div>
        {/* Top Center Green Light */}
        <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[50%] h-[50%] bg-green-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000"></div>
        {/* Bottom Left Emerald Glow */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-700/10 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-4000"></div>
        {/* Top Right Light/Green Glow */}
        <div className="absolute top-[10%] right-[-10%] w-[400px] h-[400px] bg-green-500/10 rounded-full blur-[90px] mix-blend-screen animate-blob"></div>
        {/* Additional "Light" elements */}
        <div className="absolute top-[40%] left-[20%] w-[200px] h-[200px] bg-white/5 rounded-full blur-[60px] animate-pulse duration-[5000ms]"></div>
        {/* Subtle Ambient White Light */}
        <div className="absolute bottom-[30%] right-[15%] w-[350px] h-[350px] bg-white/10 rounded-full blur-[120px] animate-blob animation-delay-5000 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.06]"></div>
    </div>
  );

  // --- RENDER FLOW ---

  // Report View (Result Generated)
  if (result) {
    return <ReportView markdown={result} onReset={handleReset} />;
  }

  // Main App
  const isSenior = formData.level === AcademicLevel.Class12 || formData.level === AcademicLevel.Undergraduate;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden selection:bg-green-500/40">
      
      <Background />

      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center justify-center p-4 bg-black/40 border border-green-500/30 rounded-2xl shadow-[0_0_40px_rgba(34,197,94,0.1)] mb-6 backdrop-blur-md animate-drift">
            <Compass className="w-10 h-10 text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.6)]" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-6xl mb-4 drop-shadow-sm">
            GoalMap <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">AI</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
            Your career, visualized. <span className="text-green-400 font-medium drop-shadow-md">Live guidance</span> for the Indian ecosystem.
          </p>
        </div>

        {/* Dark Glass Form Container */}
        <div className="glass-card bg-zinc-900/40 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden ring-1 ring-white/5">
          <div className="bg-black/20 px-6 py-4 border-b border-white/5 flex items-center gap-2 backdrop-blur-sm">
             <BookOpen className="w-5 h-5 text-green-400" />
             <h2 className="font-semibold text-white tracking-wide">Student Profile Analysis</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            
            {/* Section 1: Academic Background */}
            <section>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <span className="w-7 h-7 rounded-full bg-green-500/20 border border-green-500/50 text-green-400 font-bold flex items-center justify-center text-xs mr-3 shadow-[0_0_10px_rgba(34,197,94,0.3)]">1</span>
                Academic Background
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Rahul Sharma"
                  required
                />
                <SelectField
                  label="Current Level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  options={Object.values(AcademicLevel).map(v => ({ label: v, value: v }))}
                  required
                />
              </div>
              
              {isSenior && (
                <div className="mt-4">
                  <SelectField
                    label="Current Stream"
                    name="stream"
                    value={formData.stream || ''}
                    onChange={handleInputChange}
                    options={[
                      { label: "Science (PCM)", value: "Science (PCM)" },
                      { label: "Science (PCB)", value: "Science (PCB)" },
                      { label: "Science (PCMB)", value: "Science (PCMB)" },
                      { label: "Commerce (With Maths)", value: "Commerce (With Maths)" },
                      { label: "Commerce (Without Maths)", value: "Commerce (Without Maths)" },
                      { label: "Arts / Humanities", value: "Arts / Humanities" },
                      { label: "Vocational", value: "Vocational" },
                    ]}
                  />
                </div>
              )}

              <div className="mt-6">
                <label className="block text-sm font-medium text-green-300 mb-2">
                   Academic Results
                </label>
                
                {/* Image Upload Area */}
                <div className="mb-4">
                    {!formData.academicResultImage ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-white/10 hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:bg-green-900/10 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group backdrop-blur-sm bg-black/20"
                        >
                            <div className="p-3 bg-white/5 rounded-full mb-3 group-hover:scale-110 transition-transform border border-white/5 group-hover:border-green-500/30">
                                <Camera className="w-8 h-8 text-gray-500 group-hover:text-green-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-300 group-hover:text-white text-center">
                                Upload Photo of Marksheet / Results
                            </p>
                            <p className="text-xs text-green-500/50 mt-1">AI will analyze your grades directly</p>
                        </div>
                    ) : (
                        <div className="relative bg-black/40 border border-green-500/30 rounded-xl p-4 flex items-center justify-between shadow-[0_0_15px_rgba(34,197,94,0.1)] hover:border-green-400 transition-colors duration-300 backdrop-blur-sm">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10">
                                    <img 
                                        src={formData.academicResultImage} 
                                        alt="Result Preview" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <span className="block text-sm text-green-400 font-bold">Image Attached</span>
                                    <span className="text-xs text-gray-400">Ready for analysis</span>
                                </div>
                            </div>
                            <button 
                                type="button"
                                onClick={removeImage}
                                className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-red-400 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-black px-3 text-xs text-gray-500 uppercase tracking-widest rounded-full border border-white/10">OR</span>
                    </div>
                </div>

                <div className="mt-4">
                    <InputField
                    label="Manual Input"
                    name="academicResults"
                    value={formData.academicResults}
                    onChange={handleInputChange}
                    type="textarea"
                    placeholder="e.g. Maths: 85/100, Physics: 60/100. Strong in logic, average in languages."
                    helperText="If you didn't upload an image, please list your major subjects and marks here."
                    />
                </div>
              </div>
            </section>

            <div className="border-t border-white/10"></div>

            {/* Section 2: Personal Profile */}
            <section>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <span className="w-7 h-7 rounded-full bg-green-500/20 border border-green-500/50 text-green-400 font-bold flex items-center justify-center text-xs mr-3 shadow-[0_0_10px_rgba(34,197,94,0.3)]">2</span>
                Interests & Style
              </h3>
              
              <InputField
                label="Interests & Hobbies"
                name="interests"
                value={formData.interests}
                onChange={handleInputChange}
                type="textarea"
                placeholder="e.g. Video editing, fixing electronics, solving puzzles, history..."
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                 <InputField
                  label="Strengths"
                  name="strengths"
                  value={formData.strengths}
                  onChange={handleInputChange}
                  placeholder="e.g. Good communication, patient..."
                  required
                />
                 <InputField
                  label="Limitations / Weaknesses"
                  name="limitations"
                  value={formData.limitations}
                  onChange={handleInputChange}
                  placeholder="e.g. Fear of public speaking, weak math..."
                />
              </div>

               <div className="mt-4">
                <SelectField
                  label="Preferred Learning Style"
                  name="learningStyle"
                  value={formData.learningStyle}
                  onChange={handleInputChange}
                  options={Object.values(LearningStyle).map(v => ({ label: v, value: v }))}
                  required
                />
              </div>
            </section>

            <div className="border-t border-white/10"></div>

            {/* Section 3: Logistics & Preferences */}
            <section>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                <span className="w-7 h-7 rounded-full bg-green-500/20 border border-green-500/50 text-green-400 font-bold flex items-center justify-center text-xs mr-3 shadow-[0_0_10px_rgba(34,197,94,0.3)]">3</span>
                Logistics & Preferences
              </h3>

              {/* BUDGET SLIDER */}
              <div className="mb-8 p-6 bg-black/20 border border-white/10 rounded-xl hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] transition-all duration-300 backdrop-blur-sm">
                <label className="block text-sm font-medium text-green-300 mb-4 flex items-center gap-2">
                   <Wallet className="w-4 h-4" />
                   Annual Education Budget
                </label>
                
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="1"
                  value={budgetIndex}
                  onChange={handleBudgetChange}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
                
                <div className="mt-4 flex justify-between items-center">
                   <span className="text-xs text-gray-500">Low</span>
                   <div className="px-4 py-2 bg-green-500/10 text-green-300 rounded-lg border border-green-500/30 text-center font-bold min-w-[150px] shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                      {BUDGET_RANGES[budgetIndex]}
                   </div>
                   <span className="text-xs text-gray-500">High</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* LOCATION FIELD */}
                <div className="group">
                   <InputField 
                      label="Preferred Location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g. Bangalore, Delhi, or 'Anywhere'"
                      helperText="Where do you want to study?"
                   />
                </div>

                {/* COLLEGE TYPE FIELD */}
                <div className="group">
                    <SelectField
                      label="Preferred College Type"
                      name="collegeType"
                      value={formData.collegeType}
                      onChange={handleInputChange}
                      options={[
                        { label: "Government / Public (Low Cost)", value: "Government / Public" },
                        { label: "Private (Better Infra)", value: "Private" },
                        { label: "Distance / Open University", value: "Distance / Open" },
                        { label: "Online / Hybrid", value: "Online / Hybrid" },
                        { label: "No Preference / Any", value: "Any" },
                      ]}
                    />
                </div>
              </div>

            </section>

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-xl flex items-start gap-3 backdrop-blur-md">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center py-4 px-6 rounded-xl text-black font-bold text-lg shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300
                ${loading 
                  ? 'bg-zinc-800 cursor-not-allowed text-gray-500 shadow-none' 
                  : 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 hover:shadow-[0_0_35px_rgba(34,197,94,0.5)] hover:scale-[1.01] active:scale-[0.99]'
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <GraduationCap className="w-6 h-6 mr-2" />
                  Generate Career Roadmap
                </>
              )}
            </button>
          </form>
        </div>
        
        <p className="text-center text-gray-600 text-xs mt-8 pb-8">
          Powered by Gemini 3 • Live Career Intelligence
        </p>
      </div>
    </div>
  );
};

export default App;