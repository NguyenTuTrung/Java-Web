export const displayLoading = () => {
    document.getElementById('btnPrint')!.innerHTML = 'Đang tạo...';
};

export const displayDoc = (url: string) => {
    document.getElementById(
        'btnPrint'
    )!.innerHTML = `<a target="_blank" href="${url}">Xem hóa đơn</a>`;
    window.open(url, '_blank');
};
