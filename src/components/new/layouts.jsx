
import React from 'react';

const CenteredLayout = ({ children, theme, currentTheme }) => (
    <div className={`p-10 font-[inter] min-h-screen max-h-screen overflow-hidden ${currentTheme.bg} ${currentTheme.text}`}>
        <div className={`max-w-5xl shadow-2xl rounded-md ${currentTheme.card} p-5 mx-auto flex flex-col justify-center text-center items-center`}>
            {children}
        </div>
    </div>
);

const TwoColumnLayout = ({ children, theme, currentTheme, imageFirst = false }) => (
    <div className={`flex flex-col items-center justify-center h-screen p-10 font-[inter] ${currentTheme.bg} ${currentTheme.text}`}>
        <div className={`max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-5 rounded-md shadow-2xl ${currentTheme.card}`}>
            {imageFirst ? (
                <>
                    <div className='flex items-center w-auto col-span-1 justify-center p-5'>
                        {children[0]}
                    </div>
                    <div className='flex flex-col col-span-1 justify-between gap-8 w-full mt-10 md:my-4'>
                        {children[1]}
                    </div>
                </>
            ) : (
                <>
                    <div className='flex flex-col col-span-1 justify-between gap-8 w-full mt-10 md:my-4'>
                        {children[0]}
                    </div>
                    <div className='flex items-center w-auto col-span-1 justify-center p-5'>
                        {children[1]}
                    </div>
                </>
            )}
        </div>
    </div>
);

const FullScreenLayout = ({ children }) => (
    <div className="h-screen w-screen">
        {children}
    </div>
);

export const layouts = {
    centered: {
        name: 'Centered',
        component: CenteredLayout,
    },
    twoColumn: {
        name: 'Two Column',
        component: TwoColumnLayout,
    },
    twoColumnImageFirst: {
        name: 'Two Column (Image First)',
        component: (props) => <TwoColumnLayout {...props} imageFirst />,
    },
    fullScreen: {
        name: 'Full Screen',
        component: FullScreenLayout,
    },
};

export const SlideLayout = ({ layout, children, theme, currentTheme }) => {
    const LayoutComponent = layouts[layout]?.component || CenteredLayout;
    return <LayoutComponent theme={theme} currentTheme={currentTheme}>{children}</LayoutComponent>;
};
