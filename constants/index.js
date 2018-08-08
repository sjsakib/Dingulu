const defaultTags = [
    { name: 'good', level: '' },
    { name: 'happy', level: '' },
    { name: 'productive', level: '' },
    { name: 'fun', level: '' },
    { name: 'sad', level: '' },
    { name: 'stressful', level: '' },
    { name: 'boring', level: '' },
    { name: 'bad', level: '' }
];

const defaultTagLevels = {
    good: ['somehow', '', 'very'],
    happy: ['somehow', '', 'very'],
    productive: ['somehow', '', 'very'],
    fun: ['somehow', '', 'very'],
    sad: ['somehow', '', 'very'],
    stressful: ['somehow', '', 'very'],
    boring: ['somehow', '', 'very'],
    bad: ['somehow', '', 'very'],
};

const defaultTagColors = {
    good: '#4CAF50',
    happy: '#FF9800',
    productive: '#9C27B0',
    fun: '#009688',
    sad: '#2196F3',
    stressful: '#f44336',
    boring: '#607D8B',
    bad: '#212121'
};

export { defaultTags, defaultTagColors, defaultTagLevels };
