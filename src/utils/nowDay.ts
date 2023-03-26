export const nowDay = () => {
    return (new Date()).toISOString().split('T')[0];
}