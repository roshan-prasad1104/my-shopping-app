try {
    require('firebase/auth');
    console.log('firebase/auth resolved successfully');
} catch (e) {
    console.error('Failed to resolve firebase/auth:', e.message);
}
