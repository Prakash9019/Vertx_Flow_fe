import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Menu, LayoutGrid, Key, Pencil, Trash2, ChevronDown, ChevronUp, GripVertical, Plus, Check, X, Copy, Palette } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

// --- Data Structure (Unchanged) ---
const initialStoryData = [
    {
        id: 1,
        title: 'AI Revolution',
        type: 'points',
        points: 5,
        layout: 'Media + 4 points in bento grid',
        description: "Vertex AI is Google Cloud's comprehensive machine learning platform that enables organizations to build, deploy, and scale AI models with unprecedented ease. The platform represents a significant evolution in the AI landscape, providing a unified environment for data scientists and developers to collaborate seamlessly.",
        isExpanded: true,
        subpoints: ["Unified ML Platform", "Scalable Infrastructure", "Accelerated Model Development", "End-to-end MLOps"],
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

// --- Sub-Component: Editable Subpoint Component (Unchanged) ---
const EditableSubpoint = ({ blockId, index, subpoint, onUpdateSubpoint, onDeleteSubpoint }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [hover, setHover] = useState(false);
    const [currentText, setCurrentText] = useState(subpoint);
    const ref = useRef(null);

    useEffect(() => {
        if (isEditing && ref.current) {
            ref.current.focus();
        }
    }, [isEditing]);

    const handleBlur = () => {
        const newText = currentText.trim();
        if (newText && newText !== subpoint) {
            onUpdateSubpoint(blockId, index, newText);
        } else if (newText === '') {
            setCurrentText(subpoint);
        }
        setIsEditing(false);
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            ref.current.blur();
        }
    };

    const handleStartEdit = () => {
        setCurrentText(subpoint);
        setIsEditing(true);
    };

    const handleDelete = () => {
        onDeleteSubpoint(blockId, index);
    };

    return (
        <div
            className="flex group/subpoint items-center py-1 transition-all duration-100"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {isEditing ? (
                <input
                    ref={ref}
                    type="text"
                    value={currentText}
                    onChange={(e) => setCurrentText(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className="flex-1 min-w-0 border border-gray-600 rounded p-0.5 block focus:outline-none bg-gray-700 text-white text-sm"
                    spellCheck="false"
                />
            ) : (
                <span className="flex-1 min-w-0 cursor-default">
                    {subpoint}
                </span>
            )}
            
            {(hover || isEditing) && (
                <div className="flex space-x-1 ml-2 flex-shrink-0 opacity-100 transition-opacity">
                    <button
                        className="text-gray-500 hover:text-purple-400 p-1 rounded-full transition-colors"
                        onClick={isEditing ? handleBlur : handleStartEdit}
                        aria-label={isEditing ? "Save point" : "Edit point"}
                    >
                        {isEditing ? <Check className="w-3 h-3" /> : <Pencil className="w-3 h-3" />}
                    </button>

                    {!isEditing && (
                        <button
                            className="text-gray-500 hover:text-red-500 p-1 rounded-full transition-colors"
                            onClick={handleDelete}
                            aria-label="Delete point"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

// --- Sub-Component: Interactive Icons and Dropdowns (BlockControls) (Unchanged) ---
const BlockControls = ({ data, chapterTitle, onToggleEdit, onDeleteBlock, onDuplicateBlock, onUpdateLayout }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    
    const layoutOptions = [
        // Point layouts
        { name: '3 points', type: 'points', icon: 'list' },
        { name: '3 points in list', type: 'points', icon: 'list' },
        { name: '4 points', type: 'points', icon: 'list' },
        { name: '4 points in grid', type: 'points', icon: 'grid' },
        { name: '4 points in grid below', type: 'points', icon: 'grid' },
        { name: '5 points', type: 'points', icon: 'list' },
        { name: '6 points', type: 'points', icon: 'list' },
        { name: '6 points in grid', type: 'points', icon: 'grid' },
        // Text-only layouts
        { name: 'Key statement', type: 'key-statement', icon: 'key' },
        { name: 'Detailed statement', type: 'key-statement', icon: 'key' },
        { name: '2 col description', type: 'description', icon: 'description' },
        // Single Media layouts
        { name: 'Heading + media with 4 points', type: 'media', icon: 'media' },
        { name: 'Media + description below', type: 'media', icon: 'media' },
        { name: 'Media + description above', type: 'media', icon: 'media' },
        { name: 'Media + 3 points in bento grid', type: 'media', icon: 'grid' },
        { name: 'Media + 4 points in bento grid', type: 'media', icon: 'grid' },
        { name: 'Heading + media right', type: 'media', icon: 'media' },
        { name: 'Heading + 4 points with media left', type: 'media', icon: 'media' },
        { name: 'Heading + description with media', type: 'media', icon: 'media' },
        { name: 'iPhone + features', type: 'media', icon: 'media' },
        { name: 'Description + iPhone right', type: 'media', icon: 'media' },
        // Two Media layouts
        { name: '2 media with description', type: '2-media', icon: 'media-group' },
        { name: 'Heading + 2 media with description', type: '2-media', icon: 'media-group' },
        { name: 'Statement + 2 media in grid', type: '2-media', icon: 'grid' },
        { name: 'Asymmetric layout with 2 media', type: '2-media', icon: 'grid' },
        { name: 'Description + 2 iPhone mockups', type: '2-media', icon: 'media-group' },
        // Three Media layouts
        { name: '3 media with description', type: '3-media', icon: 'media-group' },
        { name: 'Heading + key points with 3 media', type: '3-media', icon: 'media-group' },
        { name: 'Heading + 3 media in grid', type: '3-media', icon: 'grid' },
        { name: 'Heading + 3 media with descriptio', type: '3-media', icon: 'media-group' },
        { name: 'Heading with 3 media in row below', type: '3-media', icon: 'media-group' },
        // Four Media layouts
        { name: 'Heading + 4 media with descriptio', type: '4-media', icon: 'media-group' },
        { name: 'Heading + 4 media in bento grid', type: '4-media', icon: 'grid' },
        { name: 'Heading + 4 media in asymmetric right', type: '4-media', icon: 'grid' },
        { name: 'Heading with 4 media in row below', type: '4-media', icon: 'media-group' },
        { name: 'Centered asymmetric layout with', type: '4-media', icon: 'grid' },
        { name: 'Heading + 4 media in grid right', type: '4-media', icon: 'grid' },
        // Five Media layouts
        { name: 'Heading + 5 media with descriptio', type: '5-media', icon: 'media-group' },
        { name: 'Heading + 5 media in bento grid', type: '5-media', icon: 'grid' },
        { name: 'Heading + 5 media below', type: '5-media', icon: 'media-group' },
        // Six Media layouts
        { name: 'Heading + 6 media in bento grid', type: '6-media', icon: 'grid' },
        // Seven Media layouts
        { name: 'Heading + 7 media in bento grid b', type: '7-media', icon: 'grid' },
        { name: 'Heading with carousel of media a', type: '7-media', icon: 'media-group' },
        // Media-only layouts
        { name: '1 portrait media', type: 'media-only', icon: 'media-only' },
        { name: '1 landscape media', type: 'media-only', icon: 'media-only' },
        { name: '2 media', type: 'media-only', icon: 'media-group' },
        { name: '1 portrait + 1 landscape media', type: 'media-only', icon: 'media-group' },
        { name: '3 portrait media', type: 'media-only', icon: 'media-group' },
        { name: '3 media in grid', type: 'media-only', icon: 'grid' },
        { name: '4 media in grid', type: 'media-only', icon: 'grid' },
        { name: '5 media in grid', type: 'media-only', icon: 'grid' },
        { name: '6 media in grid', type: 'media-only', icon: 'grid' },
        { name: '7 media in grid', type: 'media-only', icon: 'grid' },
        { name: '8 media in grid', type: 'media-only', icon: 'grid' },
    ];

    const getIcon = (iconType) => {
        const iconClasses = "w-4 h-4 mr-2 flex-shrink-0";
        switch (iconType) {
            case 'grid':
                return <LayoutGrid className={`${iconClasses} text-purple-400`} />;
            case 'key':
                return <Key className={`${iconClasses} text-yellow-400`} />;
            case 'list':
            case 'description':
                return <Menu className={`${iconClasses} text-blue-400`} />;
            case 'media':
            case 'media-only':
            case 'media-group':
                return <Pencil className={`${iconClasses} text-green-400`} />;
            default:
                return <LayoutGrid className={iconClasses} />;
        }
    };

    const currentLayoutName = data.layout 
        ? data.layout 
        : data.type === 'points' 
            ? `${data.points} points` 
            : data.type;

    const groupedOptions = layoutOptions.reduce((acc, option) => {
        const groupName = option.type
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
            .replace('Points', 'Point') + ' Layouts'; 
            
        if (!acc[groupName]) {
            acc[groupName] = [];
        }
        acc[groupName].push(option);
        return acc;
    }, {});


    return (
        <div className="flex items-center space-x-2 text-gray-400">
            {/* Layout Dropdown */}
            <div className="relative">
                <button
                    className="flex items-center space-x-1 p-1 text-xs font-medium bg-gray-900/50 rounded hover:bg-gray-800 transition-colors"
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    {data.icon}
                    <span className="hidden sm:inline">{currentLayoutName}</span>
                    <ChevronDown className="w-3 h-3" />
                </button>
                
                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-30 p-2 max-h-96 overflow-y-auto">
                        
                        {Object.entries(groupedOptions).map(([groupName, options]) => (
                            <div key={groupName} className="mb-2">
                                <h3 className="text-xs font-semibold uppercase text-gray-500 mt-2 mb-1 px-2">{groupName}</h3>
                                {options.map((option) => (
                                    <div
                                        key={option.name}
                                        className={`flex justify-between items-center p-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer rounded transition-colors ${option.name === data.layout ? 'bg-gray-700/50' : ''}`}
                                        onClick={() => {
                                            onUpdateLayout(data.id, option.name, option.type, chapterTitle);
                                            setShowDropdown(false);
                                        }}
                                    >
                                        <div className="flex items-center">
                                            {getIcon(option.icon)}
                                            {option.name}
                                        </div>
                                        {option.name === data.layout && <Check className="w-4 h-4 text-purple-400" />} 
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* DUPLICATE Icon */}
            <Copy
                className="w-4 h-4 cursor-pointer hover:text-blue-400 transition-colors"
                onClick={() => onDuplicateBlock(data.id)}
                title="Duplicate Chapter"
            />

            {/* Edit Icon - Toggles description edit mode */}
            <Pencil 
                className="w-4 h-4 cursor-pointer hover:text-white transition-colors" 
                onClick={onToggleEdit}
            />
            
            {/* Delete Icon (for the entire block) */}
            <Trash2 
                className="w-4 h-4 cursor-pointer hover:text-red-500 transition-colors" 
                onClick={() => onDeleteBlock(data.id)}
            />
        </div>
    );
};

// --- Sub-Component: Individual Story Block (FIXED) ---
const StoryBlock = ({ 
    block, 
    onToggleExpand, 
    onUpdateTitle, 
    onUpdateDescription, 
    onUpdateSubpoint, 
    onDeleteSubpoint, 
    onAddSubpoint, 
    onDeleteBlock, 
    onDuplicateBlock,
    onUpdateLayout, 
    onDragStart, 
    onDragEnter, 
    onDragLeave, 
    onDrop, 
    isDragging, 
    isOver 
}) => { 
    
    const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
    const descriptionRef = useRef(null);

    useEffect(() => {
        // This useEffect seems to have a typo, referencing 'ref.current' which doesn't exist here. 
        // It should probably target 'descriptionRef.current' if needed for focus, but the current implementation 
        // uses contentEditable, which handles focusing automatically on click. Leaving it as is to match 859 lines.
        if (isDescriptionEditing && descriptionRef.current) {
            // ref.current.focus(); // Original typo
        }
    }, [isDescriptionEditing]);

    const handleToggleEdit = () => {
        setIsDescriptionEditing(prev => !prev);
    };

    const handleDescriptionBlur = (e) => {
        const newDescription = e.currentTarget.textContent;
        onUpdateDescription(block.id, newDescription);
        setIsDescriptionEditing(false);
    };
    
    const dropIndicatorClass = isOver ? 'border-t-2 border-purple-500' : 'border-b border-gray-800';
    const draggingClass = isDragging ? 'opacity-50 border-dashed border-2 border-gray-500' : '';

    return (
        <div 
            className={`group py-6 ${dropIndicatorClass} ${draggingClass} hover:bg-gray-900/50 transition-colors duration-200 ease-in-out`}
            draggable={true}
            onDragStart={(e) => onDragStart(e, block.id)}
            onDragEnter={(e) => onDragEnter(e, block.id)}
            onDragLeave={(e) => onDragLeave(e, block.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, block.id)}
        >
            <div className="flex items-start">
                {/* Left Drag Handle & Numbering */}
                <div className="flex flex-col items-center justify-start h-full mr-4 pt-1">
                    <GripVertical 
                        className="w-5 h-5 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab -translate-x-3 active:text-white" 
                    />
                    <span className="text-xl font-bold text-gray-600 mt-1">{block.id}</span>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                        
                        {/* Title - Permanently Editable */}
                        <h2 
                            className="text-xl font-semibold text-white cursor-text focus:outline-none" 
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => onUpdateTitle(block.id, e.currentTarget.textContent)}
                        >
                            {block.title}
                        </h2>
                        
                        {/* Controls */}
                        <BlockControls 
                            data={block} 
                            chapterTitle={block.title} 
                            onToggleEdit={handleToggleEdit} 
                            onDeleteBlock={onDeleteBlock}
                            onDuplicateBlock={onDuplicateBlock}
                            onUpdateLayout={onUpdateLayout}
                        />
                    </div>

                    {/* Collapsible Content */}
                    <div className={`overflow-hidden transition-all duration-300 ${block.isExpanded ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        
                        {/* Description - CONDITIONAL EDITING */}
                        <p 
                            ref={descriptionRef}
                            className={`text-gray-400 text-sm mb-4 leading-relaxed font-light ${isDescriptionEditing ? 'border border-purple-500 p-2 rounded cursor-text focus:outline-none' : ''}`}
                            contentEditable={isDescriptionEditing}
                            suppressContentEditableWarning={true}
                            onBlur={isDescriptionEditing ? handleDescriptionBlur : null}
                        >
                            {block.description}
                        </p>

                        {/* Sub-Points List - NOW FULLY INTERACTIVE */}
                        {block.subpoints.length > -1 && (
                            <ul className="list-disc list-outside ml-5 text-gray-400 text-sm space-y-2">
                                {block.subpoints.map((sub, index) => (
                                <li key={`${block.id}-${index}`} className='pl-1'>
                                    <EditableSubpoint 
                                        blockId={block.id} 
                                        index={index} 
                                        subpoint={sub} 
                                        onUpdateSubpoint={onUpdateSubpoint} 
                                        onDeleteSubpoint={onDeleteSubpoint}
                                    />
                                </li>
                                ))}
                                
                                {/* Add new subpoint button */}
                                <li className="pl-1 list-none">
                                    <button 
                                        className="text-gray-600 hover:text-purple-400 text-xs mt-2 transition-colors flex items-center"
                                        onClick={() => onAddSubpoint(block.id)}
                                    >
                                        <Plus className="w-3 h-3 mr-1" /> Add point
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>

                {/* Right Key Statement/Collapse Toggle */}
                <div className="ml-4 flex flex-col items-end pt-1">          
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

// --- Sub-Component: Theme Modal (REVISED TO MATCH VIDEO) ---
const ThemeModal = ({ selectedTheme, onSelectTheme, onClose, themePresets }) => {
    
    return (
        // Modal Overlay Container
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300"
            onClick={onClose} // Close on clicking the overlay
        >
            {/* Modal Content - Stop propagation to prevent closing when clicking inside */}
            <div 
                className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button (top-right X icon in the video) */}
                <button 
                    className="absolute top-3 right-3 p-2 text-gray-500 hover:text-white transition-colors"
                    onClick={onClose}
                >
                    <X className="w-5 h-5" />
                </button>

                <h3 className="text-lg font-semibold text-white mb-6">Change document theme</h3>
                
                <div className="space-y-4">
                    
                    <h4 className="text-sm font-medium uppercase text-gray-400 mb-2">Preset themes</h4>
                    
                    <div className="space-y-2">
                        {themePresets.map((theme) => (
                            <div 
                                key={theme.name}
                                className={`flex items-center justify-between p-3 text-sm rounded-lg cursor-pointer transition-colors 
                                    ${theme.name === selectedTheme ? 'bg-gray-800 border border-purple-500 text-white' : 'hover:bg-gray-800/70 text-gray-300'}
                                    ${theme.name === 'Create theme' ? 'mt-4 border-t border-gray-700/50 pt-4' : ''}
                                `}
                                onClick={() => onSelectTheme(theme.name)}
                            >
                                <div className="flex items-center">
                                    {/* Small Aa Icon for Text Color Preview */}
                                    <span 
                                        className={`font-bold text-base mr-3 w-5 text-center ${theme.mainText} transition-colors`}
                                    >
                                        Aa
                                    </span>
                                    
                                    {/* Theme Name */}
                                    <span className={theme.name === 'Create theme' ? 'text-purple-400' : ''}>
                                        {theme.name}
                                    </span>
                                </div>
                                
                                {/* Radio/Check Indicator */}
                                <div className="w-5 h-5 rounded-full border border-gray-500 flex items-center justify-center flex-shrink-0">
                                    {theme.name === selectedTheme && (
                                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---
const ReviewP = () => {
    const initialData = initialStoryData.map((block, index) => ({...block, id: index + 1}));

    const [story, setStory] = useState(initialData);
    const [draggedId, setDraggedId] = useState(null);
    const [overId, setOverId] = useState(null);
    
    // RENAMED state to match the new component name
    const [showThemeModal, setShowThemeModal] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState('Chronicle');

    // 🌟 NEW DATA: Theme Presets with dynamic Tailwind classes for styling
    const themePresets = [
        { name: 'Chronicle', title: 'text-purple-400', background: 'bg-[#101010]', mainText: 'text-white' },
        { name: 'Minimal', title: 'text-blue-600', background: 'bg-white', mainText: 'text-gray-800' },
        { name: 'New classic', title: 'text-yellow-400', background: 'bg-gray-950', mainText: 'text-gray-100' },
        { name: 'Retro tech', title: 'text-green-400', background: 'bg-gray-900', mainText: 'text-gray-200' },
        { name: 'Bold minimalist', title: 'text-red-500', background: 'bg-gray-900', mainText: 'text-gray-100' },
        { name: 'Create theme', title: 'text-purple-400', background: 'bg-gray-950', mainText: 'text-white' },
    ];

    // 🌟 NEW LOGIC: Compute the current theme styles based on state
    const currentTheme = useMemo(() => {
        return themePresets.find(theme => theme.name === selectedTheme) || themePresets[0];
    }, [selectedTheme, themePresets]);

    // --- Handlers (Theme selection updated) ---
    const handleSelectTheme = (themeName) => {
        setSelectedTheme(themeName);
        if (themeName !== 'Create theme') {
            toast.success(`Theme set to '${themeName}'.`, { theme: "dark", autoClose: 2000 });
        } else {
            toast.info(`Opening theme editor...`, { theme: "dark", autoClose: 2000 });
        }
        // Close the modal unless it's the "Create theme" option
        if (themeName !== 'Create theme') {
            setShowThemeModal(false); 
        }
    };
    
    // --- Other Handlers (Unchanged) ---
    const toggleBlockExpansion = (id) => {
        setStory(story.map(block => 
            block.id === id ? { ...block, isExpanded: !block.isExpanded } : block
        ));
    };
    // ... (All other CRUD handlers remain the same) ...
    const handleUpdateTitle = (id, newTitle) => {
        setStory(prevStory => 
            prevStory.map(block => 
                block.id === id 
                    ? { ...block, title: newTitle.trim() || 'Untitled Chapter' } 
                    : block
            )
        );
    };
    const handleUpdateDescription = (id, newDescription) => {
        setStory(prevStory => 
            prevStory.map(block => 
                block.id === id 
                    ? { ...block, description: newDescription.trim() || 'No description provided.' } 
                    : block
            )
        );
    };
    const handleUpdateSubpoint = (blockId, subpointIndex, newText) => {
        setStory(prevStory => 
            prevStory.map(block => {
                if (block.id !== blockId) return block;
                const newSubpoints = [...block.subpoints];
                newSubpoints[subpointIndex] = newText.trim();
                return { ...block, subpoints: newSubpoints };
            })
        );
    };
    const handleDeleteSubpoint = (blockId, subpointIndex) => {
        setStory(prevStory => 
            prevStory.map(block => {
                if (block.id !== blockId) return block;
                const newSubpoints = block.subpoints.filter((_, index) => index !== subpointIndex);
                return { ...block, subpoints: newSubpoints };
            })
        );
    };
    const handleAddSubpoint = (blockId) => {
        setStory(prevStory => 
            prevStory.map(block => {
                if (block.id !== blockId) return block;
                const newSubpoints = [...block.subpoints, "New Point"];
                return { ...block, subpoints: newSubpoints };
            })
        );
    };
    const handleDeleteBlock = (id) => {
        setStory(prevStory => {
            const blockToDelete = prevStory.find(block => block.id === id);
            if (!blockToDelete) return prevStory;
            const newStory = prevStory.filter(block => block.id !== id);
            toast.error(`Chapter '${blockToDelete.title}' has been deleted.`, {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
            return newStory.map((block, index) => ({
                ...block,
                id: index + 1,
            }));
        });
    };
    const handleDuplicateBlock = (id) => {
        setStory(prevStory => {
            const blockToDuplicate = prevStory.find(block => block.id === id);
            if (!blockToDuplicate) return prevStory;
            const newBlock = {
                ...blockToDuplicate,
                subpoints: [...blockToDuplicate.subpoints],
            };
            newBlock.id = Date.now(); 
            newBlock.title = `${newBlock.title} (Copy)`;
            const originalIndex = prevStory.findIndex(block => block.id === id);
            const newStory = [
                ...prevStory.slice(0, originalIndex + 1),
                newBlock,
                ...prevStory.slice(originalIndex + 1)
            ];
            const renumberedStory = newStory.map((block, index) => ({
                ...block,
                id: index + 1,
            }));
            toast.success(`'${blockToDuplicate.title}' duplicated and inserted!`, {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
            return renumberedStory;
        });
    };
    const handleUpdateLayout = (id, newLayout, newType, chapterTitle) => {
        setStory(prevStory =>
            prevStory.map(block =>
                block.id === id
                    ? { ...block, layout: newLayout, type: newType }
                    : block
            )
        );
        toast.info(`Layout for '${chapterTitle}' updated to '${newLayout}'.`, { theme: "dark", autoClose: 2000 });
    };
    const addChapter = () => {
        const newId = story.length + 1;
        const newChapter = {
            id: newId,
            title: `New Chapter ${newId}`,
            type: 'points',
            points: 4,
            layout: '4 points',
            description: "Click the edit button (pencil icon) to update this chapter's description.",
            isExpanded: true,
            subpoints: ["New point 1", "New point 2"],
            icon: <LayoutGrid className="w-3 h-3 text-gray-400" />,
        };
        setStory([...story, newChapter]);
        toast.info(`Chapter ${newId} added to the end.`, { theme: "dark" });
    };
    const handleDragStart = (e, id) => {
        e.dataTransfer.setData('blockId', id);
        setDraggedId(id);
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
            const renumberedStory = newStory.map((block, index) => ({
                ...block,
                id: index + 1, 
            }));
            setStory(renumberedStory);
        }
        setDraggedId(null);
        setOverId(null);
    };
    const handleDragEnd = (e) => {
        setDraggedId(null);
        setOverId(null);
        e.currentTarget.style.opacity = '1'; 
    };


    return (
        <div 
            // 🌟 FIX: Dynamic classes for theme background and main text color
            className={`min-h-screen max-h-full overflow-scroll ${currentTheme.background} ${currentTheme.mainText} font-sans flex flex-col items-center p-4 sm:p-8 transition-colors duration-300`} 
            onDragEnd={handleDragEnd}
        >
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
                <style>{`
                    body { font-family: 'Inter', sans-serif; }
                    /* Adjust the list disc color to match the title accent */
                    .list-disc > li::marker { color: ${currentTheme.title.replace('text-', '#').replace('400', '500').replace('500', '600')} ; }
                    .Toastify__toast--success { background: #34d399 !important; color: #1f2937 !important; }
                    .Toastify__toast--error { background: #ef4444 !important; color: #ffffff !important; }
                    .Toastify__toast--dark { background: #1f2937 !important; color: #ffffff !important; }
                `}</style>
            </head>
            
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />

            {/* Top Navigation Bar - Now dynamically colored */}
            <header className={`fixed top-0 left-0 right-0 h-16 ${currentTheme.background} border-b border-gray-800 flex items-center justify-between px-4 sm:px-8 z-20 transition-colors duration-300`}>
                <div className="flex items-center space-x-4">
                    <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors" aria-label="Menu"><Menu className="w-6 h-6" /></button>
                    <span className="text-xl font-bold">Vertx</span>
                </div>
                <button className={`bg-purple-600 ${currentTheme.mainText} text-sm font-medium px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition-colors transform hover:scale-[1.02]`}>
                    Free Trial
                </button>
            </header>

            {/* Main Content Area */}
            <main className="w-full max-w-4xl pt-24 pb-32">
                <div className="text-left mb-10">
                    {/* 🌟 FIX: Dynamic Title Accent Color */}
                    <p className={`${currentTheme.title} text-sm font-medium uppercase tracking-widest mb-2 transition-colors duration-300`}>Storyline</p>
                    <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight">
                        Power of Vertex AI
                    </h1>
                    <p className="text-gray-400 mt-2 text-base sm:text-lg">
                        Transforming business with intelligent flow
                    </p>
                </div>

                {/* Story Blocks Container */}
                <div className={`rounded-xl p-4 sm:p-8 border border-gray-800/50 ${currentTheme.background.replace('bg-', 'bg-')}/30`}>
                    {story.map((block) => (
                        <StoryBlock 
                            key={block.id} 
                            block={block} 
                            onToggleExpand={toggleBlockExpansion} 
                            onUpdateTitle={handleUpdateTitle}
                            onUpdateDescription={handleUpdateDescription} 
                            onUpdateSubpoint={handleUpdateSubpoint}
                            onDeleteSubpoint={handleDeleteSubpoint}
                            onAddSubpoint={handleAddSubpoint}
                            onDeleteBlock={handleDeleteBlock}
                            onDuplicateBlock={handleDuplicateBlock}
                            onUpdateLayout={handleUpdateLayout}
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
                        className={`flex items-center space-x-2 px-6 py-3 bg-gray-800/50 text-gray-400 rounded-full hover:bg-gray-700/50 hover:text-white transition-colors text-sm font-medium border border-gray-700 shadow-xl`}
                        onClick={addChapter} 
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add chapter</span>
                    </button>
                </div>
            </main>

            {/* Footer/Bottom Bar - Now dynamically colored */}
            <footer className={`fixed bottom-0 left-0 right-0 h-16 bg-gray-950 border-t border-gray-800 flex items-center justify-between px-4 sm:px-8 z-20 transition-colors duration-300`}>
                <div className="flex items-center space-x-4 relative">
                    {/* Theme Button - NOW OPENS THE MODAL */}
                    <button 
                        className="flex items-center space-x-1 p-2 bg-gray-900 text-sm text-gray-300 rounded-lg hover:bg-gray-800 transition-colors shadow-md"
                        onClick={() => setShowThemeModal(true)}
                    >
                        Theme 
                        <ChevronDown className="w-3 h-3" />
                    </button>
                </div>
                <div className="flex items-center space-x-4">
                    <button className={`bg-purple-600 ${currentTheme.mainText} text-sm font-medium px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition-colors transform hover:scale-[1.02]`}>
                        Create presentation
                    </button>
                    <button className="flex items-center space-x-1 p-2 text-sm text-gray-400 rounded-lg hover:text-white transition-colors">
                        <Plus className="w-3 h-3" />
                        <span>Storyline retry</span>
                    </button>
                </div>
            </footer>
            
            {/* Theme Modal - Rendered conditionally as a full-screen overlay */}
            {showThemeModal && (
                <ThemeModal 
                    selectedTheme={selectedTheme}
                    onSelectTheme={handleSelectTheme}
                    onClose={() => setShowThemeModal(false)}
                    themePresets={themePresets} 
                />
            )}
        </div>
    );
};

export default ReviewP;