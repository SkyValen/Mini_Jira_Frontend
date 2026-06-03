export const getCookie = (name) => {
    try {
        const value = document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${name}=`))
            ?.split("=")[1];
        return value;
    } catch (error) {
        console.error(error);
    }
};
