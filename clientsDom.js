PictureMe - App.jsx (Randomized Multi-Style + Download, Regenerate & Regenerate All)
This version now includes a 'Regenerate All' button to refresh all images in one click.
PictureMe - App.jsx (Randomized Multi-Style + Download & Regenerate)
This updated version includes download and regenerate buttons for each generated image.
PictureMe - App.jsx (Randomized Multi-Style Categories)
This document contains the updated App.jsx source code. Each category contains 22 programmatically generated styles. On generate, 4-5 random styles are selected and produced in one click. Insert your Gemini API key into the API_KEY variable before running.
/* PictureMe - App.jsx (Randomized Multi-Style Categories)
   - No Firebase
   - 34 categories, each with 22 generated styles
   - On Generate: picks 4-5 random styles from the chosen category and generates those in one click
   - Insert your Gemini API key into API_KEY variable before running
*/
import React, { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});
const fetchWithRetry = (url, options, retries = 5, backoff = 1000) => {
  return new Promise((resolve, reject) => {
    const attempt = async (retryCount, delay) => {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (response.status === 429 && retryCount > 0) {
            setTimeout(() => attempt(retryCount - 1, delay * 2), delay);
          } else if (response.status === 401) {
            reject(new Error('Unauthorized - check API key.'));
          } else {
            reject(new Error(`API request failed ${response.status}`));
          }
        } else {
          resolve(response.json());
        }
      } catch (error) {
        if (retryCount > 0) {
          setTimeout(() => attempt(retryCount - 1, delay * 2), delay);
        } else {
          reject(error);
        }
      }
    };
    attempt(retries, backoff);
  });
};
const generateImageWithRetry = async (payload, totalAttempts = 3) => {
  let lastError;
  for (let attempt = 1; attempt <= totalAttempts; attempt++) {
    try {
      const API_KEY = ''; // <<< INSERT GEMINI API KEY HERE BEFORE RUNNING
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${API_KEY}`;
      const result = await fetchWithRetry(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const base64Data = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
      if (base64Data) return `data:image/png;base64,${base64Data}`;
      lastError = new Error('No image data returned');
    } catch (err) {
      lastError = err;
    }
    if (attempt < totalAttempts) await new Promise(r => setTimeout(r, 2000 * attempt));
  }
  throw new Error(`Image generation failed: ${lastError?.message || 'unknown'}`);
};
const Button = ({ children, onClick, disabled, primary=false, className='' }) => (
  <button onClick={onClick} disabled={disabled}
    className={`px-4 py-2 rounded-md font-semibold ${primary ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-white'} ${className}`}>
    {children}
  </button>
);
const TemplateCard = ({ id, name, description, icon, isSelected, onSelect }) => (
  <div onClick={() => onSelect(id)} className={`p-4 rounded-xl cursor-pointer border ${isSelected ? 'border-yellow-400 bg-yellow-900/10' : 'border-gray-700 bg-gray-900'}`}>
    <div className="text-2xl">{icon}</div>
    <h4 className="font-semibold mt-2">{name}</h4>
    <p className="text-sm text-gray-300 mt-1">{description}</p>
  </div>
);
const PhotoDisplay = ({ era, imageUrl, onDownload, onRegenerate }) => (
  <div className="relative bg-gray-900 p-3 rounded-lg shadow-md">
    <div className="aspect-square overflow-hidden rounded-md bg-gray-800">
      <img src={imageUrl} alt={era} className="w-full h-full object-cover" />
    </div>
    <div className="mt-2 flex justify-between items-center">
      <div className="text-sm text-gray-200">{era}</div>
      <div className="flex gap-3">
        <button onClick={onRegenerate} title="Regenerate" className="hover:scale-105">🔁</button>
        <button onClick={() => onDownload?.(imageUrl, era)} title="Download" className="hover:scale-105">⬇️</button>
      </div>
    </div>
  </div>
);
  <div className="relative bg-gray-900 p-3 rounded-lg shadow-md">
    <div className="aspect-square overflow-hidden rounded-md bg-gray-800">
      <img src={imageUrl} alt={era} className="w-full h-full object-cover" />
    </div>
    <div className="mt-2 flex justify-between">
      <div className="text-sm text-gray-200">{era}</div>
      <div className="flex gap-2">
        <button onClick={() => onDownload?.(imageUrl, era)} title="Download">⬇️</button>
      </div>
    </div>
  </div>
);
const makeTemplates = () => {
  const categoryDefinitions = [
    { id: 'decades', name: 'Time Traveler (Decades)', icon: '⏳', desc: 'Portraits through the decades' },
    { id: 'albumCovers', name: 'Album Covers', icon: '🎸', desc: 'Iconic album art looks' },
    { id: 'animated', name: 'Animated Characters', icon: '✍️', desc: 'Cartoon & anime transformations' },
    { id: 'artStyles', name: 'Art Styles', icon: '🎨', desc: 'Classical & modern art looks' },
    { id: 'tiktok', name: 'TikTok Glow', icon: '✨', desc: 'Trendy glossy beauty looks' },
    { id: 'barbie', name: 'Barbiecore / Pink', icon: '💖', desc: 'Bold pink editorial' },
    { id: 'pixar', name: 'Pixar / 3D', icon: '🧸', desc: 'Stylized 3D portrait' },
    { id: 'marvel', name: 'Cinematic Superhero', icon: '🦸', desc: 'Epic blockbuster hero shots' },
    { id: 'vogue', name: 'High-Fashion / VOGUE', icon: '👠', desc: 'Editorial magazine cover looks' },
    { id: 'instagram', name: 'Instagram Grid', icon: '📸', desc: 'Perfect squares for your feed' },
    { id: 'viral', name: 'Viral Meme Pack', icon: '🤣', desc: 'Meme-ready reaction images' },
    { id: 'headshots', name: 'Pro Headshots', icon: '💼', desc: 'LinkedIn & portfolio-ready' },
    { id: 'filmNoir', name: 'Film Noir', icon: '🎞️', desc: 'Black & white cinematic portraits' },
    { id: 'gothic', name: 'Gothic Portraits', icon: '🦇', desc: 'Elegant dark aesthetics' },
    { id: 'hair', name: 'Hair Styler', icon: '💇‍♀️', desc: 'Try new cuts & colors' },
    { id: 'historical', name: 'Historical Figures', icon: '📜', desc: 'Renaissance to Victorian' },
    { id: 'magazine', name: 'Magazine Covers', icon: '📰', desc: 'Famous magazine stylings' },
    { id: 'movie', name: 'Movie Posters', icon: '🎬', desc: 'Blockbuster poster compositions' },
    { id: 'tarot', name: 'Tarot Cards', icon: '🔮', desc: 'Mythic, symbolic tarot portraits' },
    { id: 'superheroes', name: 'Superheroes', icon: '🦸‍♀️', desc: 'Comic book & cinematic heroes' },
    { id: 'videogame', name: 'Video Game Avatars', icon: '🎮', desc: 'Sprites, 3D avatars & portraits' },
    { id: 'youtube', name: 'YouTube Thumbnails', icon: '📺', desc: 'Click-enticing thumbnails' },
    { id: 'zodiac', name: 'Zodiac Signs', icon: '✨', desc: 'Astrological themed portraits' },
    { id: 'seasons', name: 'Seasons', icon: '🍂', desc: 'Spring to winter spirits' },
    { id: 'aiAvatar', name: 'AI Avatars', icon: '🪪', desc: 'NFT-like avatar styles' },
    { id: 'posesPack', name: 'Poses & Looks Pack', icon: '🕺', desc: 'Model poses for any platform' },
    { id: 'street', name: 'Street Style', icon: '🧢', desc: 'Urban fashion and candid shots' },
    { id: 'editorial', name: 'Editorial', icon: '✂️', desc: 'High-concept photoshoot looks' },
    { id: 'fantasy', name: 'Fantasy', icon: '🐉', desc: 'Elves, wizards, mythical beings' },
    { id: 'scifi', name: 'Sci-Fi', icon: '🚀', desc: 'Futuristic and cyberpunk tones' },
    { id: 'minimal', name: 'Minimalist', icon: '⬜', desc: 'Clean, soft, modern portraits' },
    { id: 'surreal', name: 'Surreal', icon: '🌌', desc: 'Dreamlike, imaginative compositions' },
    { id: 'pop', name: 'Pop Culture', icon: '🎭', desc: 'Iconic pop references & stylings' },
    { id: 'festival', name: 'Festival / Coachella', icon: '🎪', desc: 'Boho festival vibes' },
    { id: 'wedding', name: 'Wedding / Bridal', icon: '💍', desc: 'Soft, romantic bridal portraits' },
    { id: 'sports', name: 'Athlete / Sports', icon: '🏅', desc: 'Action and heroic athletic shots' },
  ];
  const templates = {};
  categoryDefinitions.forEach(cat => {
    const prompts = [];
    for (let i = 1; i <= 22; i++) {
      prompts.push({
        id: `${cat.id}-style-${i}`,
        base: `${cat.name} | Style ${i} — A detailed, high-fidelity portrait in '${cat.name}' variation ${i}. Describe lighting, mood, clothing/accessories and composition (e.g. dramatic rim light, shallow depth of field, medium closeup, cinematic color grade).`
      });
    }
    templates[cat.id] = {
      name: cat.name,
      description: cat.desc,
      icon: cat.icon,
      isPolaroid: false,
      prompts
    };
  });
  return templates;
};
const templates = makeTemplates();
const pickRandom = (arr, n) => {
  const copy = [...arr];
  const result = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
};
const App = () => {
  const handleRegenerateAll = async () => {
    if (!uploadedImage || generatedImages.length === 0) return;
    const imageWithoutPrefix = uploadedImage.split(',')[1];
    setIsLoading(true);
    for (let i = 0; i < generatedImages.length; i++) {
      const item = generatedImages[i];
      const modelInstruction = `Maintain exact facial features. Transform to: ${item.label}`;
      const payload = {
        contents: [{
          parts: [
            { text: modelInstruction },
            { inlineData: { mimeType: 'image/png', data: imageWithoutPrefix } }
          ]
        }]
      };
      try {
        const imageUrl = await generateImageWithRetry(payload);
        setGeneratedImages(prev => prev.map(it => it.id === item.id ? { ...it, status: 'success', imageUrl } : it));
      } catch (err) {
        console.error('Regenerate all failed for', item.id, err);
        setGeneratedImages(prev => prev.map(it => it.id === item.id ? { ...it, status: 'failed' } : it));
      }
    }
    setIsLoading(false);
  };
  const handleRegenerate = async (item) => {
    if (!uploadedImage || !selectedTemplate) return;
    const imageWithoutPrefix = uploadedImage.split(',')[1];
    const modelInstruction = `Maintain the exact facial features and likeness of the provided reference photo. Transform the person to match the following description: ${item.label}`;
    const payload = {
      contents: [{
        parts: [
          { text: modelInstruction },
          { inlineData: { mimeType: 'image/png', data: imageWithoutPrefix } }
        ]
      }]
    };
    try {
      const imageUrl = await generateImageWithRetry(payload);
      setGeneratedImages(prev => prev.map(it => it.id === item.id ? { ...it, status: 'success', imageUrl } : it));
    } catch (err) {
      console.error('Regenerate failed for', item.id, err);
      setGeneratedImages(prev => prev.map(it => it.id === item.id ? { ...it, status: 'failed' } : it));
    }
  };
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileRef = useRef(null);
  const handleUpload = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const b64 = await toBase64(f);
    setUploadedImage(b64);
    setGeneratedImages([]);
  };
  const handleGenerate = async () => {
    if (!uploadedImage) {
      alert('Please upload an image first.');
      return;
    }
    if (!selectedTemplate) {
      alert('Please select a category.');
      return;
    }
    const active = templates[selectedTemplate];
    if (!active) {
      alert('Invalid category selected.');
      return;
    }
    const count = Math.random() < 0.5 ? 4 : 5;
    const picks = pickRandom(active.prompts, count);
    setIsLoading(true);
    setGeneratedImages(picks.map(p => ({ id: p.id, label: p.base, status: 'pending', imageUrl: null })));
    const imageWithoutPrefix = uploadedImage.split(',')[1];
    for (let i = 0; i < picks.length; i++) {
      const p = picks[i];
      const modelInstruction = `Maintain the exact facial features and likeness of the provided reference photo. Transform the person to match the following description: ${p.base} Ensure the person's core facial structure is preserved.`;
      const payload = {
        contents: [{
          parts: [
            { text: modelInstruction },
            { inlineData: { mimeType: 'image/png', data: imageWithoutPrefix } }
          ]
        }]
      };
      try {
        const imageUrl = await generateImageWithRetry(payload);
        setGeneratedImages(prev => prev.map((it, idx) => idx === i ? { ...it, status: 'success', imageUrl } : it));
      } catch (err) {
        console.error('Generation failed for', p.id, err);
        setGeneratedImages(prev => prev.map((it, idx) => idx === i ? { ...it, status: 'failed' } : it));
      }
    }
    setIsLoading(false);
  };
  const downloadDataUrl = (dataUrl, label) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${label || 'pictureme'}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="max-w-5xl mx-auto mb-6">
        <h1 className="text-3xl font-bold">PictureMe — Randomized Styles per Category</h1>
        <p className="text-gray-300 mt-1">Select a category. On generate, 4–5 random styles from that category will be produced in one click. Each category contains 22+ styles.</p>
      </header>
      <main className="max-w-7xl mx-auto grid grid-cols-4 gap-6">
        <section className="col-span-1 space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <input type="file" accept="image/*" ref={fileRef} onChange={handleUpload} />
            <div className="mt-3 flex gap-2">
              <Button onClick={() => fileRef.current?.click()}>Choose File</Button>
              <Button onClick={() => { setUploadedImage(null); setGeneratedImages([]); }}>Clear</Button>
            </div>
            <div className="mt-4">
              <label className="text-sm text-gray-400">Categories</label>
              <div className="grid grid-cols-1 gap-3 mt-2 max-h-[60vh] overflow-auto pr-2">
                {Object.keys(templates).map(key => (
                  <div key={key} onClick={() => setSelectedTemplate(key)} className={`p-3 rounded-md cursor-pointer ${selectedTemplate === key ? 'bg-yellow-900/20 border-yellow-400 border' : 'bg-gray-900 border border-gray-700'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl">{templates[key].icon} <span className="font-semibold ml-2">{templates[key].name}</span></div>
                        <div className="text-xs text-gray-400 mt-1">{templates[key].description}</div>
                      </div>
                      <div className="text-sm text-gray-300">{templates[key].prompts.length} styles</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <Button primary onClick={handleGenerate} disabled={isLoading || !uploadedImage}>Generate 4-5 Styles</Button>
<Button onClick={handleRegenerateAll} disabled={isLoading || generatedImages.length === 0}>Regenerate All</Button>
            </div>
          </div>
        </section>
        <section className="col-span-3">
          <div className="grid grid-cols-3 gap-4">
            {!uploadedImage && <div className="col-span-3 p-6 bg-gray-800 rounded-md">Upload a photo to begin.</div>}
            {uploadedImage && <div className="col-span-3 p-4 bg-gray-800 rounded-md">
              <h3 className="font-semibold">Reference</h3>
              <img src={uploadedImage} alt="reference" className="w-48 h-48 object-cover rounded-md mt-2" />
            </div>}
            {generatedImages.length === 0 && uploadedImage && <div className="col-span-3 p-4 bg-gray-800 rounded-md">No generated images yet — click Generate.</div>}
            {generatedImages.map((g, idx) => (
              <div key={g.id} className="">
                {g.status === 'pending' && <div className="p-6 bg-gray-800 rounded-md">Generating {g.id}…</div>}
                {g.status === 'failed' && <div className="p-6 bg-red-800 rounded-md">Failed: {g.id}</div>}
                {g.status === 'success' && <PhotoDisplay era={g.id} imageUrl={g.imageUrl} onDownload={downloadDataUrl} onRegenerate={() => handleRegenerate(g)} />}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
export default App;