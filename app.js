/**
 * Bear Auto Repair - Interactive Application Script
 * Prescott, Arizona
 */

document.addEventListener('DOMContentLoaded', () => {
  initShopHoursStatus();
  initServicesFilter();
  initGallery();
  initReviewsFilter();
  initBookingWizard();
  initFAQAccordion();
  initMobileMenu();
});

/* -------------------------------------------------------------
 * 1. REAL-TIME OPERATING HOURS & LIVE STATUS (ARIZONA TIME)
 * ------------------------------------------------------------- */
function initShopHoursStatus() {
  const statusBadges = document.querySelectorAll('.shop-status-badge');
  const statusTexts = document.querySelectorAll('.shop-status-text');
  
  function checkShopStatus() {
    // Arizona is UTC-7 all year round (no DST)
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const azTime = new Date(utcTime - (7 * 3600000));
    
    const day = azTime.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const hour = azTime.getHours();
    const minutes = azTime.getMinutes();
    const timeInDecimal = hour + (minutes / 60);

    const isWeekday = day >= 1 && day <= 5;
    const isOpen = isWeekday && (timeInDecimal >= 8.0 && timeInDecimal < 17.0);

    let statusHtml = '';
    let statusSummary = '';

    if (isOpen) {
      const closingHour = 5;
      const closingPeriod = 'PM';
      statusHtml = `
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <span class="w-2 h-2 rounded-full bg-emerald-400 mr-2 pulse-dot"></span>
          OPEN NOW • Closes 5:00 PM MST
        </span>
      `;
      statusSummary = "We're open right now! Call Rick & Davin at (928) 800-3263 for same-day service.";
    } else {
      let nextOpen = 'Monday at 8:00 AM';
      if (day >= 1 && day <= 4 && timeInDecimal >= 17.0) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        nextOpen = `Tomorrow (${days[day + 1]}) at 8:00 AM`;
      } else if (day >= 1 && day <= 5 && timeInDecimal < 8.0) {
        nextOpen = 'Today at 8:00 AM';
      } else if (day === 5 && timeInDecimal >= 17.0) {
        nextOpen = 'Monday at 8:00 AM';
      }

      statusHtml = `
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <span class="w-2 h-2 rounded-full bg-amber-400 mr-2"></span>
          CLOSED NOW • Opens ${nextOpen}
        </span>
      `;
      statusSummary = `Currently closed. Opens ${nextOpen}. Leave a voicemail or book below!`;
    }

    statusBadges.forEach(el => el.innerHTML = statusHtml);
    statusTexts.forEach(el => el.textContent = statusSummary);
  }

  checkShopStatus();
  setInterval(checkShopStatus, 60000); // Check every minute
}

/* -------------------------------------------------------------
 * 2. SERVICES DATA & LIVE FILTER / SEARCH
 * ------------------------------------------------------------- */
const servicesData = [
  {
    id: 'oil-change',
    name: 'Oil Changes & Routine Maintenance',
    category: 'maintenance',
    icon: 'fa-oil-can',
    popular: true,
    badge: 'Customer Favorite',
    shortDesc: 'Full synthetic, semi-synthetic, and conventional oil change packages including filter, fluid top-offs, and multi-point safety check.',
    highlights: ['3-Oil-Change Prepaid Discount Available', 'Complimentary Multi-Point Inspection', 'Free Tire Rotation with Service']
  },
  {
    id: 'brakes',
    name: 'Auto Brake Repair & Diagnostics',
    category: 'brakes',
    icon: 'fa-shield-halved',
    popular: true,
    badge: 'Safety Critical',
    shortDesc: 'Ceramic & semi-metallic brake pads, rotors, drums, calipers, brake fluid flush, and hydraulic lines inspection for ultimate stopping power.',
    highlights: ['Precision Rotor Resurfacing / Replacement', 'Brake Line Hydraulic Leak Check', 'Quiet, Zero-Noise Guarantee']
  },
  {
    id: 'engine-repair',
    name: 'Auto Engine Repair & Overhaul',
    category: 'engine',
    icon: 'fa-gears',
    popular: true,
    badge: 'Master Certified',
    shortDesc: 'From minor engine gasket leaks, timing belts, and water pumps to complete engine replacement and mechanical rebuilds.',
    highlights: ['Timing Chains & Belts', 'Head Gasket Repair', 'Complete Engine Swaps & Overhauls']
  },
  {
    id: 'check-engine-light',
    name: 'Check Engine Light & Diagnostics',
    category: 'diagnostics',
    icon: 'fa-microchip',
    popular: true,
    badge: 'Dealer-Level Tools',
    shortDesc: 'OEM-grade computer scanner diagnosis to identify exact OBD-II trouble codes, sensor faults, catalytic issues, and ignition misfires.',
    highlights: ['Pinpoint Sensor Diagnostics', 'No Guesswork Guarantee', 'Clear Explanation Before Any Work']
  },
  {
    id: 'transmission',
    name: 'Transmission Repair & Leak Inspection',
    category: 'brakes',
    icon: 'fa-cogs',
    popular: false,
    badge: 'Drivetrain',
    shortDesc: 'Automatic and manual transmission diagnostics, fluid exchange, cooler lines, pan gaskets, and torque converter inspections.',
    highlights: ['Transmission Fluid Flush', 'Shaft Seal & Gasket Leak Checks', 'Slipping & Harsh Shift Diagnosis']
  },
  {
    id: 'hvac',
    name: 'Auto HVAC & AC Repair',
    category: 'climate',
    icon: 'fa-snowflake',
    popular: true,
    badge: 'Arizona Essential',
    shortDesc: 'Keep cool in the Prescott heat and warm during winter mountain chills. Refrigerant recharge, compressor clutch, condenser, and heater core service.',
    highlights: ['R134a & 1234yf AC Systems', 'UV Dye Leak Detection', 'Cabin Blower Motor & Blend Door Repair']
  },
  {
    id: 'steering-suspension',
    name: 'Steering & Suspension Repair',
    category: 'brakes',
    icon: 'fa-car-burst',
    popular: false,
    badge: 'Ride Quality',
    shortDesc: 'Shocks, struts, control arms, ball joints, sway bars, tie rod ends, and power steering pumps for stable, wobble-free driving.',
    highlights: ['Fixes Highway Wandering & Pulling', 'Eliminates Clunks & Bumps', 'Restores Tight Road Handling']
  },
  {
    id: 'wheel-alignment',
    name: 'Wheel Alignment & Tire Care',
    category: 'brakes',
    icon: 'fa-arrows-to-circle',
    popular: false,
    badge: 'Tire Life',
    shortDesc: 'Laser computer wheel alignment for camber, caster, and toe to prevent uneven tire wear and steering pull.',
    highlights: ['Extended Tire Longevity', 'Straight-Tracking Highway Driving', 'Fuel Efficiency Boost']
  },
  {
    id: 'battery-electrical',
    name: 'Battery, Alternator & Electrical',
    category: 'diagnostics',
    icon: 'fa-car-battery',
    popular: false,
    badge: 'High Precision',
    shortDesc: 'Digital battery load testing, starter motors, high-output alternators, parasitic battery drain diagnosis, and wire harness repairs.',
    highlights: ['CCA Digital Health Analysis', 'Corrosion Cleaning & Terminal Care', 'Interstate & Premium Batteries in Stock']
  },
  {
    id: 'no-start-diagnosis',
    name: 'Auto No-Start Diagnosis',
    category: 'diagnostics',
    icon: 'fa-key',
    popular: false,
    badge: 'Fast Troubleshooting',
    shortDesc: 'Vehicle cranking but won’t fire? Rapid testing of fuel delivery, spark ignition, immobilizer, starter relay, and ECU signals.',
    highlights: ['Fuel Pump & Pressure Testing', 'Ignition Coil & Spark Plugs', 'Security & Starter Relay Verification']
  },
  {
    id: 'noise-vibration',
    name: 'Noise & Vibration Diagnosis',
    category: 'diagnostics',
    icon: 'fa-wave-square',
    popular: false,
    badge: 'Expert Mechanics',
    shortDesc: 'Eliminate mysterious whining, squealing, grinding, humming, or highway vibrations through specialized shop road testing.',
    highlights: ['Wheel Bearing & Hub Checks', 'Driveshaft & U-Joint Inspection', 'Belt & Pulley Tension Analysis']
  },
  {
    id: 'pre-purchase',
    name: 'Pre-Purchase Vehicle Inspection',
    category: 'maintenance',
    icon: 'fa-clipboard-check',
    popular: true,
    badge: 'Buyer Protection',
    shortDesc: 'Buying a used car in Prescott? Bring it to Rick & Davin for a full 150-point mechanical, structural, and computer health report before you buy.',
    highlights: ['Full Undercarriage & Rust Check', 'Computer Scan for Cleared Fault Codes', 'Save Hundreds or Thousands on Hidden Issues']
  },
  {
    id: 'fluids-filters',
    name: 'Fluids & Filters Maintenance',
    category: 'maintenance',
    icon: 'fa-filter',
    popular: false,
    badge: 'Preventative',
    shortDesc: 'Brake fluid, engine coolant/antifreeze, power steering fluid, differential gear oil, engine air filters, and cabin pollen filters.',
    highlights: ['Cooling System Chemical Flush', 'Clean Air Intake Systems', 'Differential & Transfer Case Fluids']
  },
  {
    id: 'fuel-system',
    name: 'Fuel System Cleaning & Injectors',
    category: 'engine',
    icon: 'fa-gas-pump',
    popular: false,
    badge: 'Efficiency',
    shortDesc: 'Remove carbon deposits from throttle body, intake valves, and fuel injectors for smoother idle, crisper throttle response, and improved MPG.',
    highlights: ['Fuel Rail Pressure Check', 'Intake Plenum & Valve Decarbonization', 'Restores Lost Engine Power']
  },
  {
    id: 'windows-regulators',
    name: 'Auto Window Repair & Regulators',
    category: 'glass',
    icon: 'fa-window-maximize',
    popular: false,
    badge: 'Interior Hardware',
    shortDesc: 'Power window motor replacement, window track cables, regulator assemblies, switch diagnosis, and glass track re-alignment.',
    highlights: ['Fixes Stuck Down Windows', 'OEM Heavy Duty Regulators', 'Door Panel Safe Disassembly']
  },
  {
    id: 'glass-replacement',
    name: 'Auto Window Replacement & Wipers',
    category: 'glass',
    icon: 'fa-shield',
    popular: false,
    badge: 'Clear Vision',
    shortDesc: 'Door glass, quarter glass replacement, and premium silicone all-weather windshield wiper blade installation.',
    highlights: ['Safety Tempered Automotive Glass', 'All-Weather Streak-Free Wiper Blades', 'Washer Jet Clear & Calibration']
  },
  {
    id: 'auto-lights',
    name: 'Auto Light Repair & Headlights',
    category: 'diagnostics',
    icon: 'fa-lightbulb',
    popular: false,
    badge: 'Night Safety',
    shortDesc: 'Headlight bulb replacements, LED upgrades, taillights, turn signals, brake lamp switches, and aiming alignment.',
    highlights: ['Crystal Clear Lens Restoration', 'High-Output Bulb Upgrades', 'Relay & Switch Diagnostics']
  },
  {
    id: 'oil-light-diagnosis',
    name: 'Engine Oil Light Diagnosis',
    category: 'diagnostics',
    icon: 'fa-triangle-exclamation',
    popular: false,
    badge: 'Critical Warning',
    shortDesc: 'Flashing or solid red oil pressure light? We perform manual oil pressure gauge testing, oil pump checks, and sensor replacement immediately.',
    highlights: ['Mechanical Pressure Gauge Testing', 'Oil Pressure Switch Replacement', 'Engine Bearings Safe Inspection']
  }
];

function initServicesFilter() {
  const container = document.getElementById('servicesGrid');
  const searchInput = document.getElementById('serviceSearchInput');
  const filterBtns = document.querySelectorAll('.service-filter-btn');

  if (!container) return;

  function renderServices(filter = 'all', searchQuery = '') {
    container.innerHTML = '';
    
    const query = searchQuery.trim().toLowerCase();
    const filtered = servicesData.filter(item => {
      const matchesCategory = (filter === 'all' || item.category === filter);
      const matchesSearch = !query || 
        item.name.toLowerCase().includes(query) || 
        item.shortDesc.toLowerCase().includes(query) ||
        item.highlights.some(h => h.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-12 text-center">
          <i class="fa-solid fa-screwdriver-wrench text-amber-500 text-4xl mb-4"></i>
          <h4 class="text-xl font-bold text-white mb-2">Need a Specific Repair?</h4>
          <p class="text-slate-400 max-w-md mx-auto mb-6">We handle virtually all mechanical and electrical automotive repairs on all makes and models. Give Rick & Davin a quick call!</p>
          <a href="tel:9288003263" class="inline-flex items-center px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition">
            <i class="fa-solid fa-phone mr-2"></i> Call (928) 800-3263
          </a>
        </div>
      `;
      return;
    }

    filtered.forEach(service => {
      const card = document.createElement('div');
      card.className = 'glass-panel rounded-2xl p-6 relative flex flex-col justify-between glass-panel-hover group';
      
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <i class="fa-solid ${service.icon}"></i>
            </div>
            <span class="text-[11px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-slate-800/80 text-amber-300 border border-amber-500/20">
              ${service.badge}
            </span>
          </div>
          <h3 class="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">${service.name}</h3>
          <p class="text-slate-300 text-sm leading-relaxed mb-4">${service.shortDesc}</p>
          
          <ul class="space-y-1.5 mb-6 text-xs text-slate-400">
            ${service.highlights.map(h => `
              <li class="flex items-center">
                <i class="fa-solid fa-check text-amber-400 mr-2 text-[10px]"></i>
                <span>${h}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="pt-4 border-t border-slate-800 flex items-center justify-between">
          <a href="#booking" onclick="selectServiceInWizard('${service.name}')" class="text-amber-400 hover:text-amber-300 font-semibold text-xs flex items-center group-hover:translate-x-1 transition-transform">
            <span>Book This Service</span>
            <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i>
          </a>
          <a href="tel:9288003263" class="text-slate-400 hover:text-white text-xs flex items-center" title="Call shop directly">
            <i class="fa-solid fa-phone mr-1 text-amber-400"></i> (928) 800-3263
          </a>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Initial render
  renderServices('all');

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold');
        b.classList.add('bg-slate-800/80', 'text-slate-300');
      });
      btn.classList.add('bg-amber-500', 'text-slate-950', 'font-bold');
      btn.classList.remove('bg-slate-800/80', 'text-slate-300');

      const filterCategory = btn.getAttribute('data-filter');
      renderServices(filterCategory, searchInput ? searchInput.value : '');
    });
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activeBtn = document.querySelector('.service-filter-btn.bg-amber-500');
      const activeCategory = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
      renderServices(activeCategory, e.target.value);
    });
  }
}

// Global hook for card "Book This Service" link
window.selectServiceInWizard = function(serviceName) {
  const select = document.getElementById('wizardService');
  if (select) {
    let found = false;
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].text.toLowerCase().includes(serviceName.toLowerCase()) || 
          serviceName.toLowerCase().includes(select.options[i].text.toLowerCase())) {
        select.selectedIndex = i;
        found = true;
        break;
      }
    }
    if (!found) {
      const customNotes = document.getElementById('wizardNotes');
      if (customNotes) customNotes.value = `Interested in service: ${serviceName}`;
    }
  }
};

/* -------------------------------------------------------------
 * 3. COMPLETE GALLERY & LIGHTBOX MODAL
 * ------------------------------------------------------------- */
const galleryImages = [
  {
    src: 'public/786745580_122125520852877627_8662253377961626457_n.jpg',
    title: 'Chassis Welding & Exhaust Fabrication',
    category: 'repairs',
    badge: 'Fabrication & Repair',
    caption: 'Precision underbody welding and structural repair on vehicle chassis by master technician Davin.'
  },
  {
    src: 'public/756139197_122121903368877627_2581736473379197575_n.jpg',
    title: 'Engine Block Assembly & Rebuild',
    category: 'engine',
    badge: 'Engine Rebuild',
    caption: 'Full engine teardown, clean timing chain install, new water pump, and gasket overhaul before remounting.'
  },
  {
    src: 'public/756632421_122121903398877627_5111379166515590408_n.jpg',
    title: 'Front Clip & Engine Bay Teardown',
    category: 'repairs',
    badge: 'Engine Bay Service',
    caption: 'Extensive front-end cooling, radiator, and timing component maintenance on commercial lift.'
  },
  {
    src: 'public/756347824_122121903380877627_4387396934804201730_n.jpg',
    title: 'Subframe & Transmission Alignment',
    category: 'engine',
    badge: 'Drivetrain & Transmission',
    caption: 'Underbody mechanical view showing clean oil pan, transmission bellhousing, and exhaust header alignment.'
  },
  {
    src: 'public/679972108_122108193824877627_3138353688083379062_n.jpg',
    title: '2008 Tacoma 4x4 Brake & Suspension Service',
    category: 'repairs',
    badge: 'Customer Spotlight',
    caption: 'Mary Korol’s 08 Tacoma 4x4 in for brake replacement, prioritized maintenance order, and safety check.'
  },
  {
    src: 'public/670158997_122105204630877627_8742601789179988165_n.jpg',
    title: 'Active Dual-Bay Service Floor',
    category: 'repairs',
    badge: 'Shop Bays',
    caption: 'Multi-vehicle maintenance in progress on both heavy-duty Rotary lifts with wheels off for brake service.'
  },
  {
    src: 'public/778957710_122124529382877627_2887247441469340391_n.jpg',
    title: 'Fleet & Heavy Duty Truck Repair Bay',
    category: 'repairs',
    badge: 'Fleet & Trucks',
    caption: 'GMC 2500 Heavy Duty truck, fleet service van, and customer sedan receiving simultaneous care.'
  },
  {
    src: 'public/680235791_122108193794877627_6057827811592504317_n.jpg',
    title: 'Granite Mountain Haulers Fleet Maintenance',
    category: 'repairs',
    badge: 'Local Fleet Partner',
    caption: 'Proudly servicing local Prescott businesses like Granite Mountain Haulers & Junk Removal work trucks.'
  },
  {
    src: 'public/680391512_122108193836877627_2439881826523868917_n.jpg',
    title: 'Sports Coupe & Family Van Inspection',
    category: 'repairs',
    badge: 'Domestic & Import',
    caption: 'Red sports coupe in for suspension alignment and red family minivan receiving transmission leak check.'
  },
  {
    src: 'public/758264668_122121903356877627_6809515588716639013_n.jpg',
    title: 'Engine Crane Hoist Station',
    category: 'engine',
    badge: 'Heavy Mechanical',
    caption: 'Dedicated engine removal and rebuilding workstation with hydraulic engine crane and tool trays.'
  },
  {
    src: 'public/666001133_122103393968877627_2417247709922901634_n.jpg',
    title: 'Bear Auto Repair Sign Hanging Day',
    category: 'shop',
    badge: 'Shop Roots',
    caption: 'The day the official Bear Auto Repair sign went up on Corsair Ave! Big shout-out to customer Jake Smith for helping with the bucket truck.'
  },
  {
    src: 'public/667347935_122104146200877627_3172678714270575771_n.jpg',
    title: 'Installing the Hydraulic Lifts',
    category: 'shop',
    badge: 'Facility Build',
    caption: 'Rick & Davin bolting in the high-clearance blue & red hydraulic lifts to ensure safe heavy truck service.'
  },
  {
    src: 'public/667680090_122104146242877627_5223487470997118917_n.jpg',
    title: 'Commercial Air Compressor Delivery',
    category: 'shop',
    badge: 'Equipment',
    caption: 'Forklifting our commercial multi-stage cast iron air compressor into place to power pneumatic impact tools.'
  },
  {
    src: 'public/668441493_122104146212877627_6098370476763464109_n.jpg',
    title: 'Tire Mounting & Balancing Station Setup',
    category: 'shop',
    badge: 'Tire Services',
    caption: 'Setting up the heavy-duty rim clamp tire changing machine and computerized wheel balancer.'
  },
  {
    src: 'public/668863933_122104146230877627_869796889848825500_n.jpg',
    title: 'Fresh Bulk Fluids & Oil Dispensers',
    category: 'shop',
    badge: 'Quality Fluids',
    caption: 'Sealed 55-gallon drums of premium synthetic motor oils, transmission fluids, and high-performance battery rack.'
  },
  {
    src: 'public/667585784_122103393926877627_9020974569898566612_n.jpg',
    title: 'Heavy Equipment Delivery at Corsair Ave',
    category: 'shop',
    badge: 'Shop Build',
    caption: 'Equipment transport truck arriving at 6720 Corsair Ave with brand new automotive machinery.'
  },
  {
    src: 'public/668220211_122104146260877627_1560883582462010_n.jpg',
    title: 'High-Voltage Electrical Wiring Installation',
    category: 'shop',
    badge: 'Shop Build',
    caption: 'Morrell Electric team wiring dedicated 3-phase circuits for industrial lifts and shop machinery.'
  },
  {
    src: 'public/713164025_122114970878877627_8412658269013836795_n.jpg',
    title: 'Customer Vehicles Ready for Pickup',
    category: 'vehicles',
    badge: 'Finished Jobs',
    caption: 'Toyota Tacoma 4x4 and Acura MDX freshly serviced and parked outside ready for happy owners.'
  },
  {
    src: 'public/825271434_122131040882877627_3592133645911120181_n.jpg',
    title: 'Shop Bay Doors Open at 6720 Corsair Ave #6',
    category: 'shop',
    badge: 'Our Location',
    caption: 'Front bay entrance welcoming Prescott drivers for honest, friendly vehicle repair.'
  }
];

let currentLightboxIndex = 0;

function initGallery() {
  const galleryGrid = document.getElementById('galleryGrid');
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalTitle = document.getElementById('lightboxTitle');
  const modalCaption = document.getElementById('lightboxCaption');
  const modalCounter = document.getElementById('lightboxCounter');
  const modalBadge = document.getElementById('lightboxBadge');

  if (!galleryGrid) return;

  function renderGallery(category = 'all') {
    galleryGrid.innerHTML = '';
    const filtered = category === 'all' 
      ? galleryImages 
      : galleryImages.filter(img => img.category === category);

    filtered.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'group relative overflow-hidden rounded-2xl glass-panel border border-amber-500/20 cursor-pointer aspect-square';
      card.innerHTML = `
        <img 
          src="${item.src}" 
          alt="${item.title}" 
          loading="lazy" 
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity"></div>
        <div class="absolute top-3 left-3">
          <span class="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900/90 text-amber-300 border border-amber-500/30">
            ${item.badge}
          </span>
        </div>
        <div class="absolute bottom-0 inset-x-0 p-4">
          <h4 class="text-white font-bold text-sm mb-1 group-hover:text-amber-400 transition-colors">${item.title}</h4>
          <p class="text-slate-300 text-xs line-clamp-2">${item.caption}</p>
          <div class="mt-2 flex items-center text-amber-400 text-xs font-semibold">
            <span>View Full Photo</span>
            <i class="fa-solid fa-magnifying-glass-plus ml-1.5 text-[10px]"></i>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        // Find index in overall galleryImages
        const globalIndex = galleryImages.findIndex(g => g.src === item.src);
        openLightbox(globalIndex >= 0 ? globalIndex : index);
      });

      galleryGrid.appendChild(card);
    });
  }

  function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxContent();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function updateLightboxContent() {
    const item = galleryImages[currentLightboxIndex];
    if (!item) return;

    modalImg.src = item.src;
    modalTitle.textContent = item.title;
    modalCaption.textContent = item.caption;
    modalBadge.textContent = item.badge;
    modalCounter.textContent = `${currentLightboxIndex + 1} / ${galleryImages.length}`;
  }

  function closeLightbox() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function nextLightbox() {
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
    updateLightboxContent();
  }

  function prevLightbox() {
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxContent();
  }

  // Filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold');
        b.classList.add('bg-slate-800/80', 'text-slate-300');
      });
      btn.classList.add('bg-amber-500', 'text-slate-950', 'font-bold');
      btn.classList.remove('bg-slate-800/80', 'text-slate-300');

      renderGallery(btn.getAttribute('data-filter'));
    });
  });

  // Modal event listeners
  const closeBtn = document.getElementById('lightboxClose');
  const nextBtn = document.getElementById('lightboxNext');
  const prevBtn = document.getElementById('lightboxPrev');

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', nextLightbox);
  if (prevBtn) prevBtn.addEventListener('click', prevLightbox);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('lightbox-backdrop')) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal || !modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
  });

  renderGallery('all');
}

/* -------------------------------------------------------------
 * 4. REAL VERIFIED REVIEWS WALL & OWNER REPLIES
 * ------------------------------------------------------------- */
const reviewsData = [
  {
    name: 'Kassia Frihet',
    tag: '1 review • 2 months ago',
    tagType: 'women-trusted',
    stars: 5,
    pricing: 'Great price',
    text: 'I cannot recommend Bear Auto Repair and the whole Crew highly enough. As a single woman, knowing that my car is in honest and highly capable hands means everything.',
    ownerReply: 'Thank you so much for the glowing review! We really do strive to do our best for our customers. We are honored to have earned your trust and can’t wait to take care of any other concerns that you may have in the future.'
  },
  {
    name: 'donna lemmon',
    tag: 'Local Guide · 13 reviews • 3 months ago',
    tagType: 'sun-valley',
    stars: 5,
    pricing: 'Great price',
    text: 'Rick and Davin are THE BEST!! They worked at Sun Valley before it was bought out. We are SO happy they opened their own shop. Now we know our cars are in good repair hands again. I took my 2002 PT in. They checked everything and gave me great service!',
    ownerReply: "WOW.. Thank you so very much. We appreciate you even more. Without our customers' support we wouldn't be here. Looking forward to seeing you again! (But not too soon LOL)"
  },
  {
    name: 'Jonathan Duff',
    tag: 'Local Guide · 22 reviews · 2 photos • 4 months ago',
    tagType: 'honest-pricing',
    stars: 5,
    pricing: 'Fair pricing',
    text: 'Brought my vehicle to Bear Automotive and had a great experience. They were honest and straightforward, didn’t try to oversell me on anything I didn’t need, and did excellent work with a quick turnaround. It’s hard to find a shop you can trust, and they earned it. I’ll definitely be returning.',
    ownerReply: 'Thank you for the awesome review! We pride ourselves on honesty, integrity and transparency. Looking forward to your next visit.'
  },
  {
    name: 'Mary Korol',
    tag: 'Local Guide · 13 reviews • 6 months ago',
    tagType: 'brakes',
    stars: 5,
    pricing: 'Reasonable price',
    text: 'I took my 08 Tacoma 4x4 into Bear Auto for brakes. WOW, this auto shop is a plus 5 !!! Rick wrote everything they saw that the truck required, and called me to authorize the repairs. He put the order of what was the first thing that needed to be done so I knew what was urgent vs what could wait.',
    ownerReply: 'Mary, Thank you for the kind words. We really do appreciate your business. We try to treat everybody like family here. It’s not about one big sale. It’s about being honest with customers and earning their business for a lifetime.'
  },
  {
    name: 'Terri Lowstetter',
    tag: 'Local Guide · 26 reviews • 4 months ago',
    tagType: 'oil-special',
    stars: 5,
    pricing: 'Reasonable price',
    text: 'I went to Bear Auto on the advice of a friend. Rick is personable, professional and thorough. I had an oil change. They did an inspection and tire rotation at no charge. I bought the 3 oil change special. I was driving to the dealer to service my car in Phoenix but prefer to keep my business local with a new small business owner.',
    ownerReply: 'Terri, Thanks so much for your 5 star review. We strive to treat every car as if it was our own and to treat every customer like family. Welcome to the family!! :)'
  },
  {
    name: 'Debi Slay',
    tag: '1 review • 2 months ago',
    tagType: 'women-trusted',
    stars: 5,
    pricing: 'Great price',
    text: 'Two AWESOME guys!! You won’t be sorry for having all your Auto needs done at this Auto Repair Shop. Ladies, if you feel like you are always taken advantage of when you take your vehicle in for repairs, look no further than Bear Auto Repair.',
    ownerReply: 'Debi, Thank you so very much for the great review and the vote of confidence and trust. We take pride in our work and honesty. Thanks again!!'
  },
  {
    name: 'Jake Smith',
    tag: '3 reviews • 4 months ago',
    tagType: 'engine',
    stars: 5,
    pricing: 'Reasonable price',
    text: 'Rick and the crew did a great job getting my truck running right, it had been neglected for awhile and they did a full tune up. Now it runs great! Thanks guys!',
    ownerReply: 'Jake, thanks for your great review! I’m really glad your truck is running better than before. And thank you for helping us with hanging our sign. Look forward to seeing you again in the near future.'
  },
  {
    name: 'Tina Vilart',
    tag: '2 reviews · 1 photo • 5 months ago',
    tagType: 'honest-pricing',
    stars: 5,
    pricing: 'Great price',
    text: 'I’ve had a great experience with Bear Auto Repair. They took the time to explain what was going on with my vehicle in a way that actually made sense, and I never felt pressured into unnecessary repairs.',
    ownerReply: 'Tina, thank you for the kind words. We are in it for the long haul and not just one big sale. We try to treat everybody like we treat our own family.'
  },
  {
    name: 'Wendy Dias',
    tag: 'Local Guide · 211 reviews · 85 photos • 4 months ago',
    tagType: 'honest-pricing',
    stars: 5,
    pricing: 'Reasonable price',
    text: 'Great customer service!! The only place my family and I will bring our cars to. Reasonably priced. All work was explained to me beforehand so that I was well informed.',
    ownerReply: 'Wendy, thanks for the great review. We look forward to seeing you on your next visit.'
  },
  {
    name: 'Spark Plug Gary',
    tag: 'Local Guide · 15 reviews · 2 photos • 3 months ago',
    tagType: 'oil-special',
    stars: 5,
    pricing: 'Great service',
    text: 'Rick is the best ! I can finally use my oil filter and oil ! In and out with both our cars. Works great ! Thank you !',
    ownerReply: 'Of course Gary and thanks for your business!'
  },
  {
    name: 'Loretta Colborn',
    tag: 'Local Guide · 24 reviews • 6 months ago',
    tagType: 'sun-valley',
    stars: 5,
    pricing: 'Honest & Quick',
    text: 'So happy to find Rick and Davin have opened their own shop! Bear Auto Repair is quick, honest and professional! I highly recommend them!',
    ownerReply: 'We are so happy you found us as well. Thank you so much for your business and your support.'
  },
  {
    name: 'Meredith Glascock',
    tag: '2 reviews • 2 months ago',
    tagType: 'sun-valley',
    stars: 5,
    pricing: 'Reliable',
    text: 'I followed the owner to his new shop due to the fact he’s honest, reliable and has an excellent technician.',
    ownerReply: 'Thank you Meredith, It was wonderful to reconnect with you. We truly appreciate you!'
  },
  {
    name: 'Athena Rose',
    tag: '12 reviews · 3 photos • 5 months ago',
    tagType: 'women-trusted',
    stars: 5,
    pricing: 'Awesome Quality',
    text: 'Awesome customer service, great quality service. I highly recommend. Davin was great!! 😊',
    ownerReply: 'Athena, Thank you for the positive review. We look forward to seeing you again in the future.'
  },
  {
    name: 'M Estrada',
    tag: '11 reviews · 4 photos • 4 months ago',
    tagType: 'honest-pricing',
    stars: 5,
    pricing: 'Great price',
    text: 'Fair pricing, fast repairs, and honest workers. I couldn’t ask for more and I will definitely be coming back!',
    ownerReply: 'Thank you very much for your kind review! Looking forward to being your go-to shop.'
  },
  {
    name: 'Young Lu',
    tag: 'Local Guide · 22 reviews · 13 photos • 3 months ago',
    tagType: 'honest-pricing',
    stars: 5,
    pricing: 'Top mechanic',
    text: 'The best neighbor, the best mechanic, the best service—highly recommended.',
    ownerReply: 'Thank you so very much for your recommendation and the awesome review. Looking forward to doing more business with you in the future.'
  },
  {
    name: 'Wendy Ulch',
    tag: '3 reviews • 5 months ago',
    tagType: 'women-trusted',
    stars: 5,
    pricing: 'Great prices',
    text: 'Bear Auto is thorough, honest and great prices. I won’t go anywhere else. Friendly and clean.',
    ownerReply: 'Thank you so very much! We look forward to seeing you again.'
  }
];

function initReviewsFilter() {
  const reviewsGrid = document.getElementById('reviewsGrid');
  const filterBtns = document.querySelectorAll('.review-filter-btn');

  if (!reviewsGrid) return;

  function renderReviews(filterType = 'all') {
    reviewsGrid.innerHTML = '';
    const filtered = filterType === 'all' 
      ? reviewsData 
      : reviewsData.filter(r => r.tagType === filterType);

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'glass-panel rounded-2xl p-6 relative flex flex-col justify-between glass-panel-hover border border-amber-500/20';

      card.innerHTML = `
        <span class="quote-watermark">“</span>
        <div>
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-1 text-amber-400 text-sm">
              ${Array(item.stars).fill('<i class="fa-solid fa-star"></i>').join('')}
            </div>
            <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <i class="fa-solid fa-tag text-[10px] mr-1"></i>${item.pricing}
            </span>
          </div>

          <p class="text-slate-200 text-sm italic leading-relaxed mb-4 relative z-10">
            "${item.text}"
          </p>

          <div class="mb-4">
            <h4 class="font-bold text-white text-sm">${item.name}</h4>
            <p class="text-slate-400 text-xs">${item.tag}</p>
          </div>
        </div>

        <div class="mt-2 pt-4 border-t border-slate-800 bg-slate-900/40 -mx-6 -mb-6 p-4 rounded-b-2xl">
          <div class="flex items-start space-x-2.5">
            <div class="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5 border border-amber-500/30">
              <i class="fa-solid fa-paw"></i>
            </div>
            <div>
              <div class="flex items-center space-x-1.5">
                <span class="text-xs font-bold text-amber-300">Rick & Davin (Bear Auto)</span>
                <span class="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-mono">Owner</span>
              </div>
              <p class="text-slate-300 text-xs mt-1 leading-snug">
                "${item.ownerReply}"
              </p>
            </div>
          </div>
        </div>
      `;

      reviewsGrid.appendChild(card);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold');
        b.classList.add('bg-slate-800/80', 'text-slate-300');
      });
      btn.classList.add('bg-amber-500', 'text-slate-950', 'font-bold');
      btn.classList.remove('bg-slate-800/80', 'text-slate-300');

      renderReviews(btn.getAttribute('data-review-filter'));
    });
  });

  renderReviews('all');
}

/* -------------------------------------------------------------
 * 5. INTERACTIVE BOOKING & ESTIMATE WIZARD
 * ------------------------------------------------------------- */
function initBookingWizard() {
  const form = document.getElementById('appointmentForm');
  const successModal = document.getElementById('bookingSuccessModal');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('wizardName')?.value || 'Valued Customer';
    const phone = document.getElementById('wizardPhone')?.value || '';
    const service = document.getElementById('wizardService')?.value || 'General Diagnosis';
    const vehicle = document.getElementById('wizardVehicle')?.value || 'Vehicle';
    const date = document.getElementById('wizardDate')?.value || 'Earliest Available';

    const confirmationDetails = document.getElementById('successDetails');
    if (confirmationDetails) {
      confirmationDetails.innerHTML = `
        <div class="bg-slate-900/80 rounded-xl p-4 border border-slate-800 text-left space-y-2 text-sm text-slate-300">
          <p><strong class="text-white">Customer:</strong> ${name}</p>
          <p><strong class="text-white">Phone:</strong> ${phone}</p>
          <p><strong class="text-white">Service:</strong> <span class="text-amber-400">${service}</span></p>
          <p><strong class="text-white">Vehicle:</strong> ${vehicle}</p>
          <p><strong class="text-white">Preferred Time:</strong> ${date}</p>
        </div>
      `;
    }

    if (successModal) {
      successModal.classList.remove('hidden');
      successModal.classList.add('flex');
    }
  });

  if (closeSuccessBtn && successModal) {
    closeSuccessBtn.addEventListener('click', () => {
      successModal.classList.add('hidden');
      successModal.classList.remove('flex');
      form.reset();
    });
  }
}

/* -------------------------------------------------------------
 * 6. FAQ ACCORDION
 * ------------------------------------------------------------- */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = !answer.classList.contains('hidden');

      // Close all others
      faqItems.forEach(other => {
        const otherAnswer = other.querySelector('.faq-answer');
        const otherIcon = other.querySelector('.faq-icon');
        if (otherAnswer) otherAnswer.classList.add('hidden');
        if (otherIcon) {
          otherIcon.classList.remove('rotate-180', 'text-amber-400');
          otherIcon.classList.add('text-slate-400');
        }
      });

      if (!isOpen) {
        answer.classList.remove('hidden');
        if (icon) {
          icon.classList.add('rotate-180', 'text-amber-400');
          icon.classList.remove('text-slate-400');
        }
      }
    });
  });
}

/* -------------------------------------------------------------
 * 7. MOBILE NAVIGATION TOGGLE
 * ------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const menuIcon = document.getElementById('mobileMenuIcon');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileNav) return;

  function closeMenu() {
    mobileNav.classList.add('hidden');
    if (menuIcon) {
      menuIcon.classList.remove('fa-xmark');
      menuIcon.classList.add('fa-bars');
    }
  }

  function toggleMenu() {
    const isHidden = mobileNav.classList.toggle('hidden');
    if (menuIcon) {
      if (isHidden) {
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
      } else {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-xmark');
      }
    }
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileNav.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeMenu();
    }
  });
}

