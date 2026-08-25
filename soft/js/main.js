// JavaScript source code
document.addEventListener('DOMContentLoaded', () => {
    // 1. Handle Modals
    const modalTargets = document.querySelectorAll('[data-modal-target]');
    const modals = document.querySelectorAll('.modal-overlay');
    const modalCloses = document.querySelectorAll('.modal-close');

    modalTargets.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const targetId = trigger.getAttribute('data-modal-target');
            const targetModal = document.getElementById(targetId);
            if (targetModal) targetModal.setAttribute('data-open', 'true');
        });
    });

    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.modal-overlay').setAttribute('data-open', 'false');
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.setAttribute('data-open', 'false');
        });
    });

    // 2. Handle Mobile Drawer
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerClose = document.querySelector('.drawer-close');
    const scrim = document.querySelector('.scrim');

    const toggleDrawer = (open) => {
        if (mobileDrawer) mobileDrawer.setAttribute('data-open', open);
    };

    if (menuToggle) menuToggle.addEventListener('click', () => toggleDrawer('true'));
    if (drawerClose) drawerClose.addEventListener('click', () => toggleDrawer('false'));
    if (scrim) scrim.addEventListener('click', () => toggleDrawer('false'));
});