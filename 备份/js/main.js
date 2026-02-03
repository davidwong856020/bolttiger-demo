/* ============================================
   INITIALIZATION
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initDustCanvas();
  initGoldenFlakes();
  initNavigation();
  initLineChart();
  initStats();
  initParticleEffects();
  initMintPage();
  initFundPage();
  initMyPage();
});

/* ============================================
   GOLDEN DUST CANVAS - Soft Sunlit Particles
   ============================================ */
function initDustCanvas() {
  const canvas = document.getElementById('dustCanvas');
  const ctx = canvas.getContext('2d');
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  
  const particles = [];
  const particleCount = 60; // Fewer but softer particles
  
  for (let i = 0; i < particleCount; i++) {
    // Warm golden color variations
    const colorVariant = Math.random();
    let r, g, b;
    if (colorVariant < 0.33) {
      // Bright gold
      r = 255; g = 200 + Math.random() * 55; b = 100 + Math.random() * 50;
    } else if (colorVariant < 0.66) {
      // Warm orange gold
      r = 245; g = 166 + Math.random() * 40; b = 35 + Math.random() * 30;
    } else {
      // Soft cream
      r = 255; g = 220 + Math.random() * 35; b = 150 + Math.random() * 50;
    }
    
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 1,
      speedY: -Math.random() * 0.2 - 0.05, // Slower, more gentle
      speedX: (Math.random() - 0.5) * 0.15,
      drift: Math.random() * Math.PI * 2, // For gentle horizontal drift
      opacity: Math.random() * 0.4 + 0.1, // More subtle
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01 + Math.random() * 0.015,
      r, g, b
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      // Gentle floating motion
      p.y += p.speedY;
      p.drift += 0.01;
      p.x += p.speedX + Math.sin(p.drift) * 0.3; // Gentle swaying
      p.pulse += p.pulseSpeed;
      
      // Reset when off screen
      if (p.y < -20) {
        p.y = canvas.height + 20;
        p.x = Math.random() * canvas.width;
      }
      if (p.x < -20) p.x = canvas.width + 20;
      if (p.x > canvas.width + 20) p.x = -20;
      
      // Soft pulsing glow
      const glow = Math.sin(p.pulse) * 0.25 + 0.75;
      const currentOpacity = p.opacity * glow;
      
      // Create soft, blurry particle
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
      gradient.addColorStop(0, `rgba(${p.r}, ${p.g}, ${p.b}, ${currentOpacity})`);
      gradient.addColorStop(0.4, `rgba(${p.r}, ${p.g}, ${p.b}, ${currentOpacity * 0.5})`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

/* ============================================
   GOLDEN FLAKES - Soft sunlit dust
   ============================================ */
function initGoldenFlakes() {
  const container = document.getElementById('flakes');
  const flakeCount = 15; // Fewer, more elegant
  
  for (let i = 0; i < flakeCount; i++) {
    const flake = document.createElement('div');
    flake.className = 'flake';
    
    const size = 3 + Math.random() * 5;
    const left = 20 + Math.random() * 60; // Concentrate in center area
    const delay = Math.random() * 20;
    const duration = 15 + Math.random() * 15; // Slower, more graceful
    
    // Vary the warmth of each flake
    const warmth = Math.random();
    let bg;
    if (warmth < 0.33) {
      bg = 'radial-gradient(circle, rgba(255, 230, 180, 0.7) 0%, rgba(255, 200, 120, 0.3) 40%, transparent 70%)';
    } else if (warmth < 0.66) {
      bg = 'radial-gradient(circle, rgba(255, 210, 140, 0.6) 0%, rgba(245, 180, 100, 0.25) 40%, transparent 70%)';
    } else {
      bg = 'radial-gradient(circle, rgba(255, 200, 100, 0.5) 0%, rgba(245, 166, 35, 0.2) 40%, transparent 70%)';
    }
    
    flake.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${size}px;
      background: ${bg};
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      filter: blur(${0.5 + Math.random()}px);
    `;
    
    container.appendChild(flake);
  }
}

/* ============================================
   NAVIGATION & PAGE TRANSITIONS
   ============================================ */
let isTransitioning = false;

function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (isTransitioning) return;
      const page = item.dataset.page;
      switchPage(page);
    });
  });
}

function switchPage(pageName) {
  if (isTransitioning) return;
  
  const currentPage = document.querySelector('.page.active');
  const targetPage = document.getElementById(`page-${pageName}`);
  
  if (!targetPage || currentPage === targetPage) return;
  
  isTransitioning = true;
  
  // Update nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === pageName);
  });
  
  // Transition effect
  const transition = document.getElementById('pageTransition');
  
  // Page leave animation
  currentPage.classList.add('leaving');
  
  setTimeout(() => {
    currentPage.classList.remove('active', 'leaving');
    targetPage.classList.add('active', 'entering');
    
    setTimeout(() => {
      targetPage.classList.remove('entering');
      isTransitioning = false;
      
      // Init page-specific effects
      if (pageName === 'home') {
        initStats();
        initLineChart();
      }
    }, 600);
  }, 400);
}

window.switchPage = switchPage;

/* ============================================
   MY PAGE FUNCTIONALITY (鎴戠殑)
   ============================================ */
function initMyPage() {
  // Orbit Ring Animation
  const canvas = document.getElementById('orbitRingCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 100 * dpr;
    canvas.height = 100 * dpr;
    ctx.scale(dpr, dpr);
    
    const centerX = 50;
    const centerY = 50;
    const radius = 38;
    
    // Particles
    const particles = [];
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        angle: (Math.PI * 2 / particleCount) * i + Math.random() * 0.5,
        speed: 0.008 + Math.random() * 0.006,
        size: 1 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.7,
        fadeSpeed: 0.01 + Math.random() * 0.02
      });
    }
    
    function drawOrbitRing() {
      ctx.clearRect(0, 0, 100, 100);
      
      // Draw ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(245, 166, 35, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw and update particles
      particles.forEach(p => {
        p.angle += p.speed;
        p.opacity += p.fadeSpeed;
        
        if (p.opacity > 1 || p.opacity < 0.2) {
          p.fadeSpeed *= -1;
        }
        
        const x = centerX + Math.cos(p.angle) * radius;
        const y = centerY + Math.sin(p.angle) * radius;
        
        // Glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, p.size * 3);
        gradient.addColorStop(0, `rgba(245, 166, 35, ${p.opacity})`);
        gradient.addColorStop(0.5, `rgba(245, 166, 35, ${p.opacity * 0.3})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(x, y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Core
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 220, 150, ${p.opacity})`;
        ctx.fill();
      });
      
      requestAnimationFrame(drawOrbitRing);
    }
    
    drawOrbitRing();
  }
  
  // Invite Modal
  const openBtn = document.getElementById('openInviteModal');
  const modal = document.getElementById('inviteModal');
  const closeBtn = document.getElementById('closeInviteModal');
  const closeBtn2 = document.getElementById('closeInviteBtn');
  const copyBtn = document.getElementById('copyInviteCode');
  const codeEl = document.getElementById('inviteCode');
  
  // Generate random 6-digit code
  function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      codeEl.textContent = generateCode();
      modal.classList.add('show');
    });
  }
  
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  }
  
  if (closeBtn2 && modal) {
    closeBtn2.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  }
  
  if (copyBtn && codeEl) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeEl.textContent).then(() => {
        const originalText = copyBtn.querySelector('span').textContent;
        copyBtn.querySelector('span').textContent = '宸插鍒?;
        setTimeout(() => {
          copyBtn.querySelector('span').textContent = originalText;
        }, 1500);
      });
    });
  }
  
  // Close on backdrop click
  if (modal) {
    modal.querySelector('.invite-modal-backdrop').addEventListener('click', () => {
      modal.classList.remove('show');
    });
  }
  
  // Transfer Coming Soon Modal
  const transferOpenBtn = document.getElementById('openTransferModal');
  const transferModal = document.getElementById('transferComingModal');
  const transferCloseBtn = document.getElementById('closeTransferModal');
  
  if (transferOpenBtn && transferModal) {
    transferOpenBtn.addEventListener('click', () => {
      transferModal.classList.add('show');
    });
  }
  
  if (transferCloseBtn && transferModal) {
    transferCloseBtn.addEventListener('click', () => {
      transferModal.classList.remove('show');
    });
  }
  
  // Close on backdrop click
  if (transferModal) {
    transferModal.querySelector('.coming-modal-backdrop').addEventListener('click', () => {
      transferModal.classList.remove('show');
    });
  }
}

/* ============================================
   FUND PAGE FUNCTIONALITY (鍩洪噾)
   ============================================ */
function initFundPage() {
  const yieldCanvas = document.getElementById('yieldRingCanvas');
  const yieldValueEl = document.getElementById('totalYieldValue');
  
  if (!yieldCanvas) return;
  
  const ctx = yieldCanvas.getContext('2d');
  const centerX = 50;
  const centerY = 50;
  const radius = 38;
  
  // Animation state
  let animationFrame = 0;
  let particles = [];
  
  // Create particles
  for (let i = 0; i < 20; i++) {
    particles.push({
      angle: Math.random() * Math.PI * 2,
      speed: 0.005 + Math.random() * 0.01,
      radius: radius - 5 + Math.random() * 10,
      size: 1 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.7
    });
  }
  
  function drawYieldRing() {
    ctx.clearRect(0, 0, 100, 100);
    animationFrame++;
    
    // Outer glow
    const glowGradient = ctx.createRadialGradient(centerX, centerY, radius - 10, centerX, centerY, radius + 15);
    glowGradient.addColorStop(0, 'rgba(245, 166, 35, 0)');
    glowGradient.addColorStop(0.5, 'rgba(245, 166, 35, 0.1)');
    glowGradient.addColorStop(1, 'rgba(245, 166, 35, 0)');
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 10, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();
    
    // Background ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(245, 166, 35, 0.1)';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Animated gradient ring
    const gradient = ctx.createLinearGradient(0, 0, 100, 100);
    const hueShift = (animationFrame * 0.5) % 360;
    gradient.addColorStop(0, `hsla(${40 + Math.sin(animationFrame * 0.02) * 10}, 90%, 55%, 0.8)`);
    gradient.addColorStop(0.5, `hsla(${35 + Math.cos(animationFrame * 0.03) * 10}, 85%, 50%, 0.9)`);
    gradient.addColorStop(1, `hsla(${45 + Math.sin(animationFrame * 0.025) * 10}, 95%, 60%, 0.8)`);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Animated particles
    particles.forEach(p => {
      p.angle += p.speed;
      const x = centerX + Math.cos(p.angle) * p.radius;
      const y = centerY + Math.sin(p.angle) * p.radius;
      const pulse = 0.5 + 0.5 * Math.sin(animationFrame * 0.05 + p.angle);
      
      ctx.beginPath();
      ctx.arc(x, y, p.size * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 166, 35, ${p.opacity * pulse})`;
      ctx.fill();
    });
    
    // Inner glow pulse
    const innerPulse = 0.5 + 0.5 * Math.sin(animationFrame * 0.03);
    const innerGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius - 5);
    innerGlow.addColorStop(0, `rgba(245, 166, 35, ${0.05 * innerPulse})`);
    innerGlow.addColorStop(1, 'rgba(245, 166, 35, 0)');
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 5, 0, Math.PI * 2);
    ctx.fillStyle = innerGlow;
    ctx.fill();
    
    requestAnimationFrame(drawYieldRing);
  }
  
  drawYieldRing();
  
  // Main Tabs: 浜у搧鍒楄〃 | 鎴戠殑鎸佷粨
  const mainTabs = document.querySelectorAll('.fund-main-tab');
  const productsContent = document.getElementById('fund-products');
  const holdingsContent = document.getElementById('fund-holdings');
  
  mainTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      mainTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const target = tab.dataset.fundMain;
      if (target === 'products') {
        productsContent.style.display = 'block';
        holdingsContent.style.display = 'none';
      } else {
        productsContent.style.display = 'none';
        holdingsContent.style.display = 'block';
      }
    });
  });
  
  // Product Cards Selection
  const poolCards = document.querySelectorAll('.fund-pool-card');
  const depositTitle = document.getElementById('depositTitle');
  const depositRateNum = document.getElementById('depositRateNum');
  const lockPeriodEl = document.getElementById('depositLockPeriod');
  
  let currentProductType = 'flexible';
  
  const productData = {
    flexible: { name: '娲绘湡', rate: '43%', lock: '闅忓瓨闅忓彇', taxRate: 0.02, taxDesc: '娲绘湡绂诲満绋? 2% (鏈噾+鏀剁泭)' },
    fixed: { name: '瀹氭湡', rate: '53%', lock: '90 澶?, taxRate: 0.50, taxDesc: '瀹氭湡绂诲満绋? 50% (浠呮湰閲?' }
  };
  
  poolCards.forEach(card => {
    card.addEventListener('click', () => {
      poolCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      
      currentProductType = card.dataset.fundType;
      const product = productData[currentProductType];
      
      // Update deposit section
      depositTitle.textContent = product.name;
      depositRateNum.textContent = product.rate;
      lockPeriodEl.textContent = product.lock;
    });
  });
  
  // Deposit functionality
  const depositInput = document.getElementById('fundDepositInput');
  const depositMaxBtn = document.getElementById('fundDepositMaxBtn');
  const depositBtn = document.getElementById('fundDepositBtn');
  const depositError = document.getElementById('fundDepositError');
  const mockBalance = 99970.71;
  
  depositMaxBtn.addEventListener('click', () => {
    depositInput.value = mockBalance;
    depositError.textContent = '';
    depositBtn.disabled = false;
  });
  
  depositInput.addEventListener('input', () => {
    const value = parseFloat(depositInput.value) || 0;
    if (value > mockBalance) {
      depositError.textContent = '浣欓涓嶈冻';
      depositBtn.disabled = true;
    } else if (value <= 0) {
      depositError.textContent = '';
      depositBtn.disabled = true;
    } else {
      depositError.textContent = '';
      depositBtn.disabled = false;
    }
  });
  
  depositBtn.addEventListener('click', () => {
    const value = parseFloat(depositInput.value) || 0;
    if (value > 0 && value <= mockBalance) {
      alert(`鎴愬姛瀛樺叆 ${value} BOT 鍒?{productData[currentProductType].name}`);
      depositInput.value = '';
      depositBtn.disabled = true;
    }
  });
  
  // Withdraw Modal
  const withdrawModal = document.getElementById('fundWithdrawModal');
  const modalClose = document.getElementById('fundModalClose');
  const modalBackdrop = document.getElementById('fundModalBackdrop');
  const withdrawTypeLabel = document.getElementById('withdrawTypeLabel');
  const withdrawAmount = document.getElementById('withdrawAmount');
  const withdrawHint = document.getElementById('withdrawHint');
  const withdrawReceive = document.getElementById('withdrawReceive');
  const withdrawTaxNotice = document.getElementById('withdrawTaxNotice');
  const withdrawConfirmBtn = document.getElementById('fundWithdrawConfirmBtn');
  
  // Withdraw button click handlers
  document.querySelectorAll('.holding-withdraw-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      const principal = parseFloat(btn.dataset.principal);
      const current = parseFloat(btn.dataset.current);
      const product = productData[type];
      
      withdrawModal.classList.add('show');
      
      if (type === 'flexible') {
        // 娲绘湡: 鏈噾+鏀剁泭, 2%绋?        const total = current;
        const afterTax = total * (1 - product.taxRate);
        
        withdrawTypeLabel.textContent = '娲绘湡鎸佷粨';
        withdrawAmount.textContent = current.toFixed(4);
        withdrawHint.textContent = '鏈噾 + 鏀剁泭';
        withdrawReceive.textContent = afterTax.toFixed(4);
        withdrawTaxNotice.querySelector('span').textContent = product.taxDesc;
      } else {
        // 瀹氭湡: 浠呮湰閲? 50%绋?(鎻愬墠鎻愬彇)
        const afterTax = principal * (1 - product.taxRate);
        
        withdrawTypeLabel.textContent = '瀹氭湡鎸佷粨 (鎻愬墠鎻愬彇)';
        withdrawAmount.textContent = principal.toFixed(4);
        withdrawHint.textContent = '浠呮湰閲?(鏃犳敹鐩?';
        withdrawReceive.textContent = afterTax.toFixed(4);
        withdrawTaxNotice.querySelector('span').textContent = product.taxDesc;
      }
    });
  });
  
  function closeModal() {
    withdrawModal.classList.remove('show');
  }
  
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  
  if (withdrawConfirmBtn) {
    withdrawConfirmBtn.addEventListener('click', () => {
      alert('鎻愬彇鎴愬姛锛丅OT宸茶浆鍏ヨ祫閲戣处鎴?);
      closeModal();
    });
  }
}

/* ============================================
   MINT PAGE FUNCTIONALITY
   ============================================ */
function initMintPage() {
  // Mint Tabs
  const mintTabs = document.querySelectorAll('.mint-tab');
  const mintContents = document.querySelectorAll('.mint-tab-content');
  
  mintTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.mintTab;
      
      mintTabs.forEach(t => t.classList.remove('active'));
      mintContents.forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(`mint-${targetTab}`).classList.add('active');
    });
  });
  
  // Package Selection
  const packageCards = document.querySelectorAll('.package-card');
  const selectedPackageEl = document.querySelector('.selected-package');
  const purchaseRangeEl = document.querySelector('.purchase-range');
  const purchaseBtn = document.querySelector('.purchase-btn');
  const purchaseError = document.getElementById('purchaseError');
  
  const packageData = {
    basic: { name: 'V-Basic', min: 1, max: 2, rate: 1.0 },
    pro: { name: 'V-Pro', min: 2, max: 3, rate: 1.0 },
    elite: { name: 'V-Elite', min: 3, max: Infinity, rate: 1.0 }
  };
  
  let currentPackage = 'basic';
  
  packageCards.forEach(card => {
    card.addEventListener('click', () => {
      const pkg = card.dataset.package;
      currentPackage = pkg;
      
      packageCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      
      if (selectedPackageEl) {
        selectedPackageEl.textContent = packageData[pkg].name;
      }
      if (purchaseRangeEl) {
        const maxText = packageData[pkg].max === Infinity ? '鈭? : packageData[pkg].max;
        purchaseRangeEl.textContent = `褰撳墠濂楅閲戦鑼冨洿锛?{packageData[pkg].min} - ${maxText} USDT`;
      }
      
      // Recalculate and validate
      validateAndCalculate();
    });
  });
  
  // Set initial selected state
  if (packageCards.length > 0) {
    packageCards[0].classList.add('selected');
  }
  
  // Purchase Amount Input
  const purchaseInput = document.getElementById('purchaseAmount');
  if (purchaseInput) {
    purchaseInput.addEventListener('input', validateAndCalculate);
  }
  
  function validateAndCalculate() {
    const amount = parseFloat(purchaseInput?.value) || 0;
    const pkg = packageData[currentPackage];
    const dailyProfit = amount * (pkg.rate / 100);
    const totalProfit = dailyProfit * 12; // Assuming 12 days cycle
    
    // Update estimates
    const infoValues = document.querySelectorAll('.purchase-info .info-value');
    if (infoValues.length >= 2) {
      infoValues[0].textContent = totalProfit.toFixed(2) + ' USDT';
      infoValues[1].textContent = dailyProfit.toFixed(2) + ' USDT';
    }
    
    // Validate amount
    let error = '';
    let isValid = true;
    
    if (amount === 0) {
      isValid = false;
    } else if (amount < pkg.min) {
      error = `閲戦涓嶈兘浣庝簬 ${pkg.min} USDT`;
      isValid = false;
    } else if (pkg.max !== Infinity && amount > pkg.max) {
      error = `閲戦涓嶈兘瓒呰繃 ${pkg.max} USDT`;
      isValid = false;
    }
    
    // Update UI
    if (purchaseError) {
      purchaseError.textContent = error;
    }
    if (purchaseBtn) {
      purchaseBtn.disabled = !isValid;
    }
  }
  
  // Record Tabs - Filter records by type
  const recordTabs = document.querySelectorAll('.record-tab');
  const recordItems = document.querySelectorAll('.record-item');
  
  recordTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const recordType = tab.dataset.record;
      
      recordTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Filter records
      recordItems.forEach(item => {
        const typeEl = item.querySelector('.record-type');
        if (!typeEl) return;
        
        const isPrincipal = typeEl.classList.contains('principal') || (!typeEl.classList.contains('profit') && !typeEl.classList.contains('transfer'));
        const isProfit = typeEl.classList.contains('profit');
        const isTransfer = typeEl.classList.contains('transfer');
        
        let show = false;
        if (recordType === 'all') show = true;
        if (recordType === 'principal' && isPrincipal) show = true;
        if (recordType === 'profit' && isProfit) show = true;
        if (recordType === 'transfer' && isTransfer) show = true;
        
        item.style.display = show ? 'flex' : 'none';
      });
    });
  });
  
  // Initialize with first tab filter (show all)
  if (recordTabs.length > 0) {
    recordTabs[0].click();
  }
  
  // Transfer Amount Input - validate max
  const transferAmountInput = document.getElementById('transferAmount');
  const transferMaxBtn = document.querySelector('.transfer-max-btn');
  const mockBalance = 0; // In real app, get from state
  
  if (transferAmountInput) {
    transferAmountInput.addEventListener('input', () => {
      const value = parseFloat(transferAmountInput.value) || 0;
      if (value > mockBalance) {
        transferAmountInput.value = mockBalance;
      }
    });
  }
  
  if (transferMaxBtn && transferAmountInput) {
    transferMaxBtn.addEventListener('click', () => {
      transferAmountInput.value = mockBalance.toFixed(4);
    });
  }
}

/* ============================================
   SWAP FUNCTIONALITY
   ============================================ */
function initSwap() {
  const fromInput = document.getElementById('swapFromInput');
  const toInput = document.getElementById('swapToInput');
  
  // Exchange rate: 1 BOT = 0.2848 USDT (inverse of 3.512)
  const exchangeRate = 0.2848;
  
  if (fromInput && toInput) {
    fromInput.addEventListener('input', () => {
      const value = parseFloat(fromInput.value) || 0;
      toInput.value = value ? (value * exchangeRate).toFixed(2) : '';
    });
  }
  
  // Token dropdown functionality
  const fromDropdown = document.getElementById('fromTokenDropdown');
  const toDropdown = document.getElementById('toTokenDropdown');
  
  // Setup dropdown toggles
  [fromDropdown, toDropdown].forEach(dropdown => {
    if (!dropdown) return;
    
    const btn = dropdown.querySelector('.token-select-btn');
    const options = dropdown.querySelector('.token-options');
    
    // Toggle dropdown on button click
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Close other dropdowns
      document.querySelectorAll('.token-select-dropdown.open').forEach(d => {
        if (d !== dropdown) d.classList.remove('open');
      });
      
      dropdown.classList.toggle('open');
    });
    
    // Handle option selection
    options.querySelectorAll('.token-option:not(.disabled)').forEach(option => {
      option.addEventListener('click', () => {
        const token = option.dataset.token;
        const iconHtml = option.querySelector('.token-icon-circle').outerHTML;
        
        // Update button
        btn.querySelector('.token-icon-circle').outerHTML = iconHtml;
        btn.querySelector('span').textContent = token;
        btn.dataset.token = token;
        
        // Update selected state
        options.querySelectorAll('.token-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        
        // Close dropdown
        dropdown.classList.remove('open');
      });
    });
  });
  
  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.token-select-dropdown.open').forEach(d => {
      d.classList.remove('open');
    });
  });
  
  // Quick amount buttons
  document.querySelectorAll('#page-swap .quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const percent = btn.textContent;
      const balance = 1234.56; // Mock balance
      let amount;
      
      switch(percent) {
        case '25%': amount = balance * 0.25; break;
        case '50%': amount = balance * 0.5; break;
        case '75%': amount = balance * 0.75; break;
        case 'MAX': amount = balance; break;
      }
      
      if (fromInput && amount) {
        fromInput.value = amount.toFixed(2);
        fromInput.dispatchEvent(new Event('input'));
      }
    });
  });
}

// Initialize swap on DOM ready
document.addEventListener('DOMContentLoaded', initSwap);

/* ============================================
   LINE CHART
   ============================================ */
function initLineChart() {
  const canvas = document.getElementById('priceChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  
  const width = rect.width;
  const height = rect.height;
  
  // Generate smooth curve data
  const points = [];
  let price = 0.12;
  const segments = 14;
  
  for (let i = 0; i <= segments; i++) {
    const change = (Math.random() - 0.3) * 0.02;
    price = Math.max(0.08, Math.min(0.3, price + change));
    points.push({
      x: (i / segments) * width,
      y: height - 20 - ((price - 0.05) / 0.3) * (height - 40)
    });
  }
  
  let progress = 0;
  
  function draw() {
    ctx.clearRect(0, 0, width, height);
    
    const currentProgress = Math.min(progress, 1);
    const visiblePoints = Math.floor(currentProgress * points.length);
    
    if (visiblePoints < 2) {
      progress += 0.03;
      requestAnimationFrame(draw);
      return;
    }
    
    // Gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(245, 166, 35, 0.4)');
    gradient.addColorStop(0.5, 'rgba(245, 166, 35, 0.15)');
    gradient.addColorStop(1, 'rgba(245, 166, 35, 0)');
    
    // Draw filled area with curve
    ctx.beginPath();
    ctx.moveTo(points[0].x, height);
    ctx.lineTo(points[0].x, points[0].y);
    
    for (let i = 1; i < visiblePoints; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    
    if (visiblePoints > 0) {
      ctx.lineTo(points[visiblePoints - 1].x, points[visiblePoints - 1].y);
      ctx.lineTo(points[visiblePoints - 1].x, height);
    }
    
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw line with glow
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < visiblePoints; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    
    if (visiblePoints > 0) {
      ctx.lineTo(points[visiblePoints - 1].x, points[visiblePoints - 1].y);
    }
    
    ctx.strokeStyle = '#F5A623';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Glow effect
    ctx.shadowColor = 'rgba(245, 166, 35, 0.6)';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Draw points
    for (let i = 0; i < visiblePoints; i++) {
      // Outer glow
      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, 8, 0, Math.PI * 2);
      const pointGradient = ctx.createRadialGradient(
        points[i].x, points[i].y, 0,
        points[i].x, points[i].y, 8
      );
      pointGradient.addColorStop(0, 'rgba(245, 166, 35, 0.3)');
      pointGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = pointGradient;
      ctx.fill();
      
      // Point
      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#F5A623';
      ctx.fill();
      
      // Inner highlight
      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF';
      ctx.fill();
    }
    
    if (progress < 1) {
      progress += 0.02;
      requestAnimationFrame(draw);
    }
  }
  
  draw();
}

/* ============================================
   STATS ANIMATION
   ============================================ */
function initStats() {
  const statValues = document.querySelectorAll('.stat-value[data-target]');
  
  statValues.forEach(el => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    animateValue(el, 0, target, 2000, suffix);
  });
}

function animateValue(el, start, end, duration, suffix) {
  const startTime = performance.now();
  const isFloat = end % 1 !== 0;
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    
    const current = start + (end - start) * eased;
    
    if (isFloat) {
      el.textContent = current.toFixed(1) + suffix;
    } else {
      el.textContent = Math.floor(current).toLocaleString() + suffix;
    }
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

/* ============================================
   PARTICLE EFFECTS
   ============================================ */
function initParticleEffects() {
  // Add particles around decorator
  const decorParticles = document.getElementById('decorParticles');
  if (decorParticles) {
    createOrbitalParticles(decorParticles, 8);
  }
  
  // Add particles around ring
  const ringParticles = document.getElementById('ringParticles');
  if (ringParticles) {
    createOrbitalParticles(ringParticles, 6);
  }
}

function createOrbitalParticles(container, count) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    const angle = (i / count) * 360;
    const size = 2 + Math.random() * 2;
    const distance = 40 + Math.random() * 15;
    const duration = 3 + Math.random() * 2;
    const delay = Math.random() * 2;
    
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, #FFD93D 0%, transparent 70%);
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(${angle}deg) translateX(${distance}px);
      animation: orbitalFloat ${duration}s ease-in-out infinite;
      animation-delay: ${delay}s;
      box-shadow: 0 0 6px rgba(245, 166, 35, 0.6);
    `;
    
    container.appendChild(particle);
  }
}

// Add orbital animation
const orbitalStyle = document.createElement('style');
orbitalStyle.textContent = `
  @keyframes orbitalFloat {
    0%, 100% {
      opacity: 0.3;
      transform: translate(-50%, -50%) rotate(var(--angle, 0deg)) translateX(var(--dist, 40px)) scale(0.8);
    }
    50% {
      opacity: 1;
      transform: translate(-50%, -50%) rotate(calc(var(--angle, 0deg) + 180deg)) translateX(calc(var(--dist, 40px) + 10px)) scale(1.2);
    }
  }
`;
document.head.appendChild(orbitalStyle);

/* ============================================
   CONSOLE BRANDING
   ============================================ */
console.log(
  '%c鈿?BOLTTIGER %c ULTIMATE LUXURY ',
  'background: linear-gradient(135deg, #FFD93D 0%, #F5A623 50%, #CC7A00 100%); color: #030305; font-size: 24px; font-weight: bold; padding: 15px 25px; border-radius: 8px 0 0 8px; font-family: serif;',
  'background: #030305; color: #F5A623; font-size: 16px; padding: 15px 25px; border-radius: 0 8px 8px 0; border: 1px solid #F5A623;'
);
