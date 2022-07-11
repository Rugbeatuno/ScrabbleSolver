

export function createIcon(image, callback) {
    let icon = document.createElement('div');
    icon.className = 'icon';
    icon.style.backgroundImage = `url(${image})`;
    icon.style.backgroundSize = 'cover';

    icon.addEventListener('click', callback);
    return icon;
}