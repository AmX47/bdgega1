// انتظر حتى يتم تحميل المستند بالكامل
document.addEventListener('DOMContentLoaded', () => {
    // احصل على زر تغيير اللون
    const changeColorBtn = document.getElementById('changeColorBtn');
    
    // قائمة بالألوان العشوائية
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', 
        '#96CEB4', '#FFEEAD', '#D4A5A5',
        '#9B59B6', '#3498DB', '#E74C3C'
    ];
    
    // إضافة حدث النقر على الزر
    changeColorBtn.addEventListener('click', () => {
        // اختيار لون عشوائي
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        // تغيير لون خلفية الحاوية
        document.querySelector('.container').style.backgroundColor = randomColor;
    });
});
