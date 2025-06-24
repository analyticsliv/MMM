export const updateStoreField = (field: SelectableFields, value: string[], setSelectedMediaSpend, setSelectedMedia, setSelectedControl) => {
    switch (field) {
        case 'mediaSpend':
            setSelectedMediaSpend(value);
            break;
        case 'media':
            setSelectedMedia(value);
            break;
        case 'control':
            setSelectedControl(value);
            break;
    }
};