
async function check() {
    try {
        const res = await fetch('http://10.235.16.200:3000/api/products');
        const data = await res.json();
        console.log('Total Products:', data.length);
        data.forEach(p => {
            console.log(`- ${p.name} | Category: ${p.category} | Price: ${p.price}`);
        });
    } catch (e) {
        console.error(e);
    }
}
check();
