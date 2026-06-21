"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button, Input, Modal, Toast, Loader } from "@/components/ui";

export default function Showcase() {
  const [darkMode, setDarkMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors">
        <Navbar />

        <main className="flex-1 px-4 sm:px-8 py-10 max-w-3xl mx-auto w-full">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-green-700 dark:text-green-400">
                Component Showcase
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Reusable UI building blocks for PahadPulse AI
              </p>
            </div>
            <Button variant="secondary" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </Button>
          </div>

          <section className="flex flex-col gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="font-semibold mb-3 text-gray-700 dark:text-gray-200">Button</h2>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setShowToast(true)}>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="font-semibold mb-3 text-gray-700 dark:text-gray-200">Input</h2>
              <Input
                label="Your Name"
                placeholder="Enter your name"
                value={inputValue}
                onChange={setInputValue}
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="font-semibold mb-3 text-gray-700 dark:text-gray-200">Modal</h2>
              <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
              <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Example Modal">
                This is a demo modal from the component library.
              </Modal>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="font-semibold mb-3 text-gray-700 dark:text-gray-200">Loader</h2>
              <div className="flex gap-6 items-center">
                <Loader size="sm" />
                <Loader size="md" />
                <Loader size="lg" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="font-semibold mb-3 text-gray-700 dark:text-gray-200">Toast</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click the Primary button above to trigger a toast.
              </p>
            </div>
          </section>
        </main>

        <Toast message="Button clicked!" type="success" show={showToast} />
        <Footer />
      </div>
    </div>
  );
}
