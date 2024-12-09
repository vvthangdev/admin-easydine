import React, { useState, useRef, useEffect } from 'react';

export default function CategoryNavigation({ selectedCategory, onSelectCategory }) {
    const [isScrollable, setIsScrollable] = useState(false);
    const scrollContainerRef = useRef(null);

    // Sample categories data - replace with your actual data
    const categories = [
        { id: 'all', name: 'Tất cả', icon: '🍽️' },
        { id: 'cơm', name: 'Cơm', icon: '🍚' },
        { id: 'phở', name: 'Phở', icon: '🍜' },
        { id: 'bún', name: 'Bún', icon: '🍜' },
        { id: 'nước', name: 'Đồ uống', icon: '🥤' },
        { id: 'chay', name: 'Đồ chay', icon: '🥗' },
        { id: 'bánh', name: 'Bánh mì', icon: '🍞' }
    ];

    // Check if scroll buttons should be shown
    useEffect(() => {
        const checkScrollable = () => {
            const container = scrollContainerRef.current;
            if (container) {
                setIsScrollable(container.scrollWidth > container.clientWidth);
            }
        };

        checkScrollable();
        window.addEventListener('resize', checkScrollable);
        return () => window.removeEventListener('resize', checkScrollable);
    }, []);

    // Scroll functions
    const scroll = (direction) => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = 200;
            const scrollLeft = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            container.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative bg-white shadow-sm">
            <div className="container mx-auto px-4 relative">
                {/* Scroll Shadow Indicators */}
                {isScrollable && (
                    <>
                        {/* Left Shadow */}
                        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

                        {/* Right Shadow */}
                        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                        {/* Scroll Buttons */}
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-200 text-gray-600 hover:text-amber-600"
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-200 text-gray-600 hover:text-amber-600"
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </>
                )}

                {/* Categories Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto scrollbar-hide py-4 gap-3"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onSelectCategory(category.id)}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200
                                ${selectedCategory === category.id
                                ? 'bg-amber-500 text-white shadow-md hover:bg-amber-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                            `}
                        >
                            <span className="text-lg">{category.icon}</span>
                            <span className="font-medium">{category.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile Category Grid */}
            <div className="md:hidden grid grid-cols-4 gap-2 p-4 border-t border-gray-100">
                {categories.slice(0, 8).map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onSelectCategory(category.id)}
                        className={`
                            flex flex-col items-center p-2 rounded-lg transition-all duration-200
                            ${selectedCategory === category.id
                            ? 'bg-amber-50 text-amber-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }
                        `}
                    >
                        <span className="text-2xl mb-1">{category.icon}</span>
                        <span className="text-xs font-medium text-center">{category.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}