import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Download, CheckCircle, Globe } from 'lucide-react';

export default function Home() {
  const [svgCode, setSvgCode] = useState('');
  const [pngUrl, setPngUrl] = useState('');
  const [error, setError] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handlePaste = (event) => {
      const items = event.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image/svg+xml') !== -1) {
          const blob = items[i].getAsFile();
          const reader = new FileReader();
          reader.onload = (e) => setSvgCode(e.target.result);
          reader.readAsText(blob);
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const convertSvgToPng = async () => {
    if (!svgCode.trim().startsWith('<svg')) {
      setError('Please enter valid SVG code.');
      setPngUrl('');
      return;
    }

    setError('');
    setIsConverting(true);

    try {
      const svg = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svg);
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL('image/png');
        setPngUrl(pngUrl);
        URL.revokeObjectURL(url);
        setIsConverting(false);
      };

      img.src = url;
    } catch (err) {
      setError('An error occurred during conversion. Please try again.');
      setIsConverting(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => setSvgCode(e.target.result);
      reader.readAsText(file);
    } else {
      setError('Please upload a valid SVG file.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
      <Head>
        <title>SVG2PNG | Instant SVG to PNG Conversion</title>
        <meta name="description" content="Transform your SVGs to PNGs with our free easy to use online converter." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      <header className="backdrop-blur-md bg-white/10 fixed w-full z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="ml-2 text-xl font-bold">SVG2PNG</span>
            </div>
            <div className="flex items-center">
              <a href="https://rede.io/?utm_source=svg2png" target="_blank" className="text-white hover:text-indigo-200 transition-colors">
                <Globe className="h-6 w-6" />
              </a>
            </div>
          </div>
        </nav>
      </header>

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold mb-4 block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
            SVG to PNG Conversion
          </h1>
          <p className="text-xl text-indigo-200">
            Lightning-fast SVG to PNG conversion made by the team behind the daily tech newsletter <Link href={"https://rede.io/?utm_source=svg2png"} className="underline" target="_blank">Rede.io</Link>.
          </p>
          <p className="text-xl text-indigo-200">
            Drag, drop, paste, or upload your SVG - we'll handle the rest.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto backdrop-blur-lg bg-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="p-8">
            <div
              className="border-2 border-dashed border-indigo-300 rounded-xl p-4 mb-4 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => fileInputRef.current.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".svg"
                className="hidden"
              />
              <p className="text-center text-indigo-200">
                Drag and drop your SVG here, or click to upload
              </p>
            </div>
            <textarea
              className="w-full h-48 p-4 bg-white/5 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all resize-none"
              value={svgCode}
              onChange={(e) => setSvgCode(e.target.value)}
              placeholder="Or paste your SVG code here..."
            />
            <div className="mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
                onClick={convertSvgToPng}
                disabled={isConverting}
              >
                {isConverting ? 'Converting...' : 'Convert to PNG'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-red-400"
              >
                {error}
              </motion.p>
            )}
          </div>
          {pngUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-indigo-900/30 p-8 border-t border-indigo-700"
            >
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <CheckCircle className="mr-2 text-green-400" />
                Conversion Complete
              </h2>
              <img src={pngUrl} alt="Converted PNG" className="max-w-full h-auto mb-4 rounded-xl shadow-lg" />
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={pngUrl}
                download="converted.png"
                className="inline-flex items-center px-6 py-3 rounded-xl text-indigo-900 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <Download className="mr-2 h-5 w-5" />
                Download PNG
              </motion.a>
            </motion.div>
          )}
        </motion.div>
      </main>

      <footer className="backdrop-blur-md bg-white/10 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-indigo-200 text-sm">
            &copy; {new Date().getFullYear()} Crafted with 🧡 + 🤖 by the <Link href={"https://rede.io/?utm_source=svg2png"} className="underline" target="_blank">Rede team</Link>.
          </p>
        </div>
      </footer>
    </div>
  );
}