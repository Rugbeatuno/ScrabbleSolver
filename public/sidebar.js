

export function createIcon(image, title, callback) {
    let icon = document.createElement('div');
    icon.className = 'icon';
    icon.style.backgroundImage = `url(${image})`;
    icon.style.backgroundSize = 'cover';
    icon.title = title;

    icon.addEventListener('click', callback);
    return icon;
}