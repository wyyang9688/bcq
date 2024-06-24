const { showToast, showModal } = uni;

export const toast = (title: string) => {
    showToast({
        title,
        icon: "none",
        mask: true
    });
};
