/**
 * ROMANTIC CUTE BIRTHDAY CARD - JAVASCRIPT ENGINE
 * Tối ưu hóa hiệu năng, Canvas mượt mà, hỗ trợ tốt khả năng truy cập.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. CANVAS PARTICLES SYSTEM (HEARTS & SPARKLES)
    // ==========================================
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    let particlesArray = [];
    const colors = ['#ffb3c6', '#ff758f', '#ffccd5', '#ffe5ec', '#c8b6ff'];

    // Cân chỉnh kích thước chuẩn màn hình
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Đối tượng Hạt Môi Trường
    class Particle {
        constructor(isBurst = false, x = 0, y = 0) {
            this.isBurst = isBurst;
            this.x = isBurst ? x : Math.random() * canvas.width;
            this.y = isBurst ? y : canvas.height + Math.random() * 100;
            
            // Kích cỡ hình dáng hạt
            this.size = Math.random() * 6 + 4;
            this.type = Math.random() > 0.4 ? 'heart' : 'sparkle'; 
            
            // Tốc độ di chuyển hình học
            if (this.isBurst) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 5 + 2;
                this.speedX = Math.cos(angle) * speed;
                this.speedY = Math.sin(angle) * speed;
                this.life = 1.0; // Thời gian tồn tại của vụ nổ hiệu ứng
                this.decay = Math.random() * 0.02 + 0.015;
            } else {
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = -(Math.random() * 0.8 + 0.4);
            }
            
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rotation = Math.random() * Math.PI;
            this.rotationSpeed = Math.random() * 0.02 - 0.01;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color;
            if (this.isBurst) {
                ctx.globalAlpha = this.life;
            }

            if (this.type === 'heart') {
                // Thuật toán vẽ hình trái tim hoàn mỹ bằng Bezier Curves
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
                ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
                ctx.fill();
            } else {
                // Vẽ hạt lấp lánh (Sparkle) 4 cánh
                ctx.beginPath();
                for (let i = 0; i < 4; i++) {
                    ctx.lineTo(0, -this.size);
                    ctx.lineTo(this.size / 4, -this.size / 4);
                    ctx.rotate(Math.PI / 2);
                }
                ctx.fill();
            }
            ctx.restore();
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;

            if (this.isBurst) {
                this.life -= this.decay;
                this.speedX *= 0.98; // Giảm tốc độ ma sát không khí nhẹ
                this.speedY *= 0.98;
            } else {
                // Nếu bay ra khỏi màn hình thì reset lại từ đáy nền
                if (this.y < -20) {
                    this.y = canvas.height + 20;
                    this.x = Math.random() * canvas.width;
                }
            }
        }
    }

    // Khởi tạo các hạt nền lãng mạn bay chậm rãi
    function initParticles() {
        const totalAmbientParticles = window.innerWidth < 600 ? 25 : 55;
        for (let i = 0; i < totalAmbientParticles; i++) {
            particlesArray.push(new Particle(false));
        }
    }
    initParticles();

    // Tạo vụ nổ lấp lánh (Sparkle Burst) khi mở thư tình công chúa
    function createBurstEffect(x, y) {
        for (let i = 0; i < 40; i++) {
            particlesArray.push(new Particle(true, x, y));
        }
    }

    // Vòng lặp Render chuẩn màn hình 60fps
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = particlesArray.length - 1; i >= 0; i--) {
            particlesArray[i].update();
            particlesArray[i].draw();
            
            // Xóa hạt burst đã phai hết độ sáng
            if (particlesArray[i].isBurst && particlesArray[i].life <= 0) {
                particlesArray.splice(i, 1);
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ==========================================
    // 2. ENVELOPE CONTROLLER (HỆ THỐNG PHONG BÌ CHÍNH)
    // ==========================================
    const envelopeWrapper = document.getElementById('envelopeWrapper');
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');

    function handleEnvelopeClick() {
        const isOpen = envelopeWrapper.classList.contains('open');
        
        if (!isOpen) {
            // Thực hiện chuỗi hành động cinematic mịn màng
            envelopeWrapper.classList.add('shake-envelope');
            
            // Kích hoạt âm nhạc tự động ngay khi người dùng tương tác chủ động (Mẹo lách luật trình duyệt)
            // if (bgMusic.paused && !musicToggle.classList.contains('user-muted')) {
            //     //playAudio();
            // }

            setTimeout(() => {
                envelopeWrapper.classList.remove('shake-envelope');
                envelopeWrapper.classList.add('open');
                envelopeWrapper.setAttribute('aria-expanded', 'true');
                
                // Lấy tọa độ tâm phong bì để kích nổ hiệu ứng tim bay tỏa sáng khắp màn hình
                const rect = envelopeWrapper.getBoundingClientRect();
                const burstX = rect.left + rect.width / 2;
                const burstY = rect.top + rect.height / 3;
                createBurstEffect(burstX, burstY);
            }, 300); // Đợi lắc nhẹ xong mới bung nắp
        } else {
            // Đóng thư lại an toàn gọn gàng bên trong
            envelopeWrapper.classList.remove('open');
            envelopeWrapper.setAttribute('aria-expanded', 'false');
        }
    }

    // Đăng ký tương tác Click và Bàn Phím (Accessibility)
    envelopeWrapper.addEventListener('click', handleEnvelopeClick);
    envelopeWrapper.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleEnvelopeClick();
        }
    });

    // ==========================================
    // 3. AUDIO MANAGEMENT (ĐIỀU KHIỂN NHẠC NỀN)
    // ==========================================
});