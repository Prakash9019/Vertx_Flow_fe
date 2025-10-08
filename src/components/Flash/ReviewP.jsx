import React, { useState } from 'react';
import { Menu, LayoutGrid, Key, Pencil, Trash2, ChevronDown, ChevronUp, GripVertical, Plus, Check } from 'lucide-react';

// --- Data Structure ---
const initialStoryData = [
    {
        id: 1,
        title: 'AI Revolution',
        type: 'points',
        points: 5,
        layout: 'Media + 4 points in bento grid',
        description: "Vertex AI is Google Cloud's comprehensive machine learning platform that enables organizations to build, deploy, and scale AI models with unprecedented ease. The platform represents a significant evolution in the AI landscape, providing a unified environment for data scientists and developers to collaborate seamlessly.",
        isExpanded: true,
        subpoints: [],
        icon: <LayoutGrid className="w-3 h-3 text-gray-400" />,
    },
    {
        id: 2,
        title: 'Development Flow',
        type: 'key-statement',
        points: 5,
        layout: 'Key statement',
        description: "Vertex AI streamlines the ML development process with a consistent, intuitive flow:",
        isExpanded: true,
        subpoints: [
            "Data preparation with seamless integration",
            "Model training with automated hyperparameter tuning",
            "Evaluation with comprehensive metrics",
            "Deployment with scalable infrastructure",
            "Monitoring with continuous feedback loops",
        ],
        icon: <Key className="w-3 h-3 text-gray-400" />,
    },
    {
        id: 3,
        title: 'Core Capabilities',
        type: 'points',
        points: 3,
        layout: '3 points',
        description: "Vertex AI offers a robust set of capabilities:",
        isExpanded: true,
        subpoints: [
            "Custom Model Training: Fully managed environment for TensorFlow, PyTorch, and scikit-learn.",
            "Managed Datasets: Tools for data labeling and version control.",
            "Feature Store: Centralized repository for sharing and serving ML features.",
        ],
        icon: <LayoutGrid className="w-3 h-3 text-gray-400" />,
    },
];

// --- Sub-Component: Interactive Icons and Dropdowns ---
const BlockControls = ({ data }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    
    // Dummy options for the layout dropdown
    const layoutOptions = [
        'Heading + media with 4 points',
        '4 points in bento grid',
        '6 points',
        'Detailed statement',
        '5 points',
        '3 points',
    ];

    const pointsText = data.type === 'points' ? `${data.points} points` : data.layout;

    return (
        <div className="flex items-center space-x-2 text-gray-400">
            {/* Layout Dropdown */}
            <div className="relative">
                <button
                    className="flex items-center space-x-1 p-1 text-xs font-medium bg-gray-900/50 rounded hover:bg-gray-800 transition-colors"
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    {data.icon}
                    <span className="hidden sm:inline">{pointsText}</span>
                    <ChevronDown className="w-3 h-3" />
                </button>
                
                {/* Dropdown Menu - Simplified for this component */}
                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 p-2">
                        {layoutOptions.map((option) => (
                            <div
                                key={option}
                                className="flex justify-between items-center p-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer rounded"
                                onClick={() => {
                                    // In a real app, this would update the block layout state
                                    console.log(`Layout selected: ${option}`);
                                    setShowDropdown(false);
                                }}
                            >
                                {option}
                                {/* Check icon placeholder in BlockControls */}
                                {option === data.layout && <Check className="w-4 h-4 text-purple-400" />} 
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit and Delete Icons */}
            <Pencil className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
            <Trash2 className="w-4 h-4 cursor-pointer hover:text-red-500 transition-colors" />
        </div>
    );
};

// --- Sub-Component: Individual Story Block ---
const StoryBlock = ({ block, onToggleExpand, onUpdateTitle, onDragStart, onDragEnter, onDragLeave, onDrop, isDragging, isOver }) => { 
    
    // Custom class for drag-over effect
    const dropIndicatorClass = isOver ? 'border-t-2 border-purple-500' : 'border-b border-gray-800';
    const draggingClass = isDragging ? 'opacity-50 border-dashed border-2 border-gray-500' : '';

    return (
        <div 
            className={`group py-6 ${dropIndicatorClass} ${draggingClass} hover:bg-gray-900/50 transition-colors duration-200 ease-in-out`}
            draggable={true} // Make the block draggable
            onDragStart={(e) => onDragStart(e, block.id)}
            onDragEnter={(e) => onDragEnter(e, block.id)}
            onDragLeave={(e) => onDragLeave(e, block.id)}
            onDragOver={(e) => e.preventDefault()} // Must call preventDefault to allow drop
            onDrop={(e) => onDrop(e, block.id)}
        >
            <div className="flex items-start">
                {/* Left Drag Handle & Numbering */}
                <div className="flex flex-col items-center justify-start h-full mr-4 pt-1">
                    {/* Drag Handle - Added drag handle focus/active visual */}
                    <GripVertical 
                        className="w-5 h-5 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab -translate-x-3 active:text-white" 
                    />
                    <span className="text-xl font-bold text-gray-600 mt-1">{block.id}</span>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                        
                        {/* Title - INSTANTLY EDITABLE */}
                        <h2 
                            className="text-xl font-semibold text-white cursor-text focus:outline-none" 
                            contentEditable={true} // Makes the text editable
                            suppressContentEditableWarning={true} // Suppresses React warning
                            onBlur={(e) => onUpdateTitle(block.id, e.currentTarget.textContent)} // Updates state when user clicks away
                        >
                            {block.title}
                        </h2>
                        
                        {/* Controls (Dropdown, Edit, Delete) */}
                        <BlockControls data={block} />
                    </div>

                    {/* Collapsible Content */}
                    <div className={`overflow-hidden transition-all duration-300 ${block.isExpanded ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed font-light">
                            {block.description}
                        </p>

                        {/* Sub-Points List */}
                        {block.subpoints.length > 0 && (
                            <ul className="list-disc list-outside ml-5 text-gray-400 text-sm space-y-2">
                                {block.subpoints.map((sub, index) => (
                                    <li key={index} className="pl-1">
                                        {sub}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Right Key Statement/Collapse Toggle */}
                <div className="ml-4 flex flex-col items-end pt-1">
                    {block.type === 'key-statement' && (
                        <div className="text-xs text-purple-400 mb-2 whitespace-nowrap">
                            <Key className="w-3 h-3 inline-block mr-1 align-sub" />
                            Key statement
                        </div>
                    )}
                    
                    <button 
                        className="p-1 text-gray-600 hover:text-white transition-colors"
                        onClick={() => onToggleExpand(block.id)}
                    >
                        {block.isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---
const ReviewP = () => {
    const [story, setStory] = useState(initialStoryData);
    const [draggedId, setDraggedId] = useState(null);
    const [overId, setOverId] = useState(null); // ID of the item currently being dragged over

    const toggleBlockExpansion = (id) => {
        setStory(story.map(block => 
            block.id === id ? { ...block, isExpanded: !block.isExpanded } : block
        ));
    };
    
    // NEW: Function to update the title when editing stops (onBlur)
    const handleUpdateTitle = (id, newTitle) => {
        setStory(prevStory => 
            prevStory.map(block => 
                block.id === id 
                    ? { ...block, title: newTitle.trim() || 'Untitled Chapter' } 
                    : block
            )
        );
    };

    // Chapter Creation Logic
    const addChapter = () => {
        // Calculate the highest current ID and use the next number for the new block's ID and numbering
        const maxId = story.length > 0 ? Math.max(...story.map(b => b.id)) : 0;
        const newId = maxId + 1;
        
        const newChapter = {
            id: newId,
            title: `New Chapter ${newId}`,
            type: 'points',
            points: 4,
            layout: '4 points',
            description: "Click the edit button to update this chapter's content and design.",
            isExpanded: true,
            subpoints: [],
            icon: <LayoutGrid className="w-3 h-3 text-gray-400" />,
        };

        // Add the new chapter and set its expansion to true
        setStory([...story, newChapter]);
    };

    // Drag Handlers
    const handleDragStart = (e, id) => {
        e.dataTransfer.setData('blockId', id);
        setDraggedId(id);
        e.currentTarget.style.opacity = '0.5'; 
    };

    const handleDragEnter = (e, id) => {
        if (draggedId !== id) {
            setOverId(id);
        }
    };

    const handleDragLeave = (e, id) => {
        if (overId === id) {
            setOverId(null);
        }
    };

    const handleDrop = (e, targetId) => {
        e.preventDefault();
        const draggedBlockId = parseInt(e.dataTransfer.getData('blockId'));

        if (draggedBlockId !== targetId) {
            const draggedIndex = story.findIndex(b => b.id === draggedBlockId);
            const targetIndex = story.findIndex(b => b.id === targetId);

            const newStory = [...story];
            const [draggedItem] = newStory.splice(draggedIndex, 1);
            newStory.splice(targetIndex, 0, draggedItem);
            
            // Re-numbering the blocks (crucial for maintaining UI numbering)
            const renumberedStory = newStory.map((block, index) => ({
                ...block,
                // Use index + 1 for the visual ID/numbering
                // NOTE: This re-uses the `id` field for numbering, which is common but be mindful if you have external references to the original IDs.
                id: index + 1, 
            }));

            setStory(renumberedStory);
        }

        // Reset drag state and visual cues
        setDraggedId(null);
        setOverId(null);
    };

    // Drag End handler to reset opacity if dragging ends anywhere
    const handleDragEnd = (e) => {
        setDraggedId(null);
        setOverId(null);
        // Safely reset opacity on the element that initiated the drag
        if (e.currentTarget.style.opacity === '0.5') {
            e.currentTarget.style.opacity = '1';
        }
    };


    return (
        <div className="min-h-screen max-h-full overflow-scroll bg-[#101010] font-sans flex flex-col items-center p-4 sm:p-8" onDragEnd={handleDragEnd}>
            
            {/* Top Navigation Bar - Simplified */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-[#101010] border-b border-gray-800 flex items-center justify-between px-4 sm:px-8 z-20">
                <div className="flex items-center space-x-4">
                    <button className="text-gray-400 hover:text-white"><Menu className="w-6 h-6" /></button>
                    <span className="text-xl font-bold text-white">Vertx</span>
                </div>
                <button className="bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md hover:bg-purple-700 transition-colors">
                    Free Trial
                </button>
            </header>

            {/* Main Content Area */}
            <main className="w-full max-w-4xl pt-24 pb-32">
                <div className="text-left mb-10">
                    <p className="text-purple-400 text-sm font-medium uppercase tracking-widest mb-2">Storyline</p>
                    <h1 className="text-6xl font-extrabold text-white leading-tight">
                        Power of Vertex AI
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">
                        Transforming business with intelligent flow
                    </p>
                </div>

                {/* Story Blocks Container */}
                <div className="bg-gray-900/30 rounded-xl p-4 sm:p-8 border border-gray-800/50">
                    {story.map((block) => (
                        <StoryBlock 
                            key={block.id} 
                            block={block} 
                            onToggleExpand={toggleBlockExpansion} 
                            onUpdateTitle={handleUpdateTitle} // Pass the title update handler
                            onDragStart={handleDragStart}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            isDragging={draggedId === block.id}
                            isOver={overId === block.id && draggedId !== block.id}
                        />
                    ))}
                </div>

                {/* Add Chapter Button */}
                <div className="flex justify-center mt-8">
                    <button 
                        className="flex items-center space-x-2 px-6 py-3 bg-gray-800/50 text-gray-400 rounded-full hover:bg-gray-700/50 hover:text-white transition-colors text-sm font-medium border border-gray-700"
                        onClick={addChapter} 
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add chapter</span>
                    </button>
                </div>
            </main>

            {/* Footer/Bottom Bar - Simplified */}
            <footer className="fixed bottom-0 left-0 right-0 h-16 bg-gray-950 border-t border-gray-800 flex items-center justify-between px-4 sm:px-8 z-20">
                <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 p-2 bg-gray-900 text-sm text-gray-300 rounded-lg hover:bg-gray-800 transition-colors">
                        Theme <ChevronUp className="w-3 h-3" />
                    </button>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md hover:bg-purple-700 transition-colors">
                        Create presentation
                    </button>
                    <button className="flex items-center space-x-1 p-2 text-sm text-gray-400 rounded-lg hover:text-white transition-colors">
                        <Plus className="w-3 h-3" />
                        <span>Storyline retry</span>
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ReviewP;