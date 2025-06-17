    // Newsletter Form
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            // Add animation
            const button = newsletterForm.querySelector('button');
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            // Simulate API call
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                newsletterForm.reset();
                
                setTimeout(() => {
                    button.innerHTML = 'Subscribe';
                }, 2000);
            }, 1500);
        });
    }

    // Stats Counter Animation
    const stats = document.querySelectorAll('.stat-number');
    
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value + (element.textContent.includes('+') ? '+' : '');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const endValue = parseInt(stat.textContent);
                animateValue(stat, 0, endValue, 2000);
                observer.unobserve(stat);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Mobile Menu
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Category Tabs
const tabs = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('.topics-section');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const category = tab.dataset.category;
        
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show corresponding section
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === category) {
                section.classList.add('active');
            }
        });
    });
});

// Beginner Level Page Functionality
const lessonCards = document.querySelectorAll('.lesson-card');
const startButtons = document.querySelectorAll('.start-lesson');
const runButtons = document.querySelectorAll('.run-code');
const codeInputs = document.querySelectorAll('.code-input');
const consoleOutputs = document.querySelectorAll('.console-output');

// Handle lesson card expansion
startButtons.forEach(button => {
    button.addEventListener('click', () => {
        const lessonCard = button.closest('.lesson-card');
        const isActive = lessonCard.classList.contains('active');
        
        // Close all lesson cards
        lessonCards.forEach(card => card.classList.remove('active'));
        
        // Toggle current lesson card
        if (!isActive) {
            lessonCard.classList.add('active');
            button.textContent = 'Close Lesson';
        } else {
            button.textContent = 'Start Lesson';
        }
    });
});

// Handle code execution
runButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        const code = codeInputs[index].value;
        const output = consoleOutputs[index];
        
        try {
            // Create a safe evaluation environment
            const safeEval = new Function('return ' + code);
            const result = safeEval();
            output.textContent = result;
        } catch (error) {
            output.textContent = `Error: ${error.message}`;
        }
    });
});

// Progress Tracking
document.addEventListener('DOMContentLoaded', function() {
    // Initialize progress data
    let progressData = {
        coursesCompleted: 0,
        hoursLearned: 0,
        achievements: 0,
        courseProgress: {
            basics: 0,
            intermediate: 0,
            advanced: 0
        },
        streak: 0,
        recentActivity: []
    };

    // Load saved progress if exists
    const savedProgress = localStorage.getItem('pythonProProgress');
    if (savedProgress) {
        progressData = { ...progressData, ...JSON.parse(savedProgress) };
    }

    // Streak (simulate for demo)
    if (!progressData.streak) {
        progressData.streak = Math.floor(Math.random() * 7) + 1;
    }

    // Update Overview
    document.getElementById('courses-completed').textContent = progressData.coursesCompleted;
    document.getElementById('hours-learned').textContent = progressData.hoursLearned;
    document.getElementById('achievements').textContent = progressData.achievements;
    document.getElementById('current-streak').textContent = progressData.streak + ' day' + (progressData.streak === 1 ? '' : 's');

    // Calculate overall progress
    const total = progressData.courseProgress.basics + progressData.courseProgress.intermediate + progressData.courseProgress.advanced;
    const overall = Math.round(total / 3);
    // Animate circular progress
    const circBar = document.getElementById('circular-bar');
    const circLabel = document.getElementById('circular-label');
    if (circBar && circLabel) {
        let progress = 0;
        const animate = () => {
            if (progress < overall) {
                progress++;
                circLabel.textContent = progress + '%';
                circBar.style.strokeDashoffset = 282.74 - (282.74 * progress / 100);
                requestAnimationFrame(animate);
            } else {
                circLabel.textContent = overall + '%';
                circBar.style.strokeDashoffset = 282.74 - (282.74 * overall / 100);
            }
        };
        animate();
    }

    // Timeline Progress
    const timelineSections = [
        { id: 'basics', label: 'Python Basics' },
        { id: 'intermediate', label: 'Intermediate Python' },
        { id: 'advanced', label: 'Advanced Python' }
    ];
    timelineSections.forEach(sec => {
        const prog = progressData.courseProgress[sec.id] || 0;
        const bar = document.getElementById('progress-' + sec.id);
        const text = document.getElementById('progress-text-' + sec.id);
        if (bar && text) {
            bar.style.width = prog + '%';
            text.textContent = prog + '% Complete';
        }
    });
    // Timeline clickable
    document.querySelectorAll('.timeline-item.clickable').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            if (section === 'basics') window.location.href = 'beginner.html';
            if (section === 'intermediate') window.location.href = 'courses.html#intermediate';
            if (section === 'advanced') window.location.href = 'courses.html#advanced';
        });
    });

    // Achievements
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach((card, idx) => {
        if (progressData.achievements > idx) {
            card.classList.remove('locked');
        } else {
            card.classList.add('locked');
        }
    });

    // Recent Activity
    const recentList = document.getElementById('recent-activity-list');
    if (recentList) {
        recentList.innerHTML = '';
        if (progressData.recentActivity && progressData.recentActivity.length > 0) {
            progressData.recentActivity.slice(-5).reverse().forEach(act => {
                const li = document.createElement('li');
                li.textContent = act;
                recentList.appendChild(li);
            });
        } else {
            recentList.innerHTML = '<li>No recent activity yet.</li>';
        }
    }

    // Update progress display
    function updateProgressDisplay() {
        // Update stats
        document.querySelectorAll('.stat-number').forEach(stat => {
            const statType = stat.closest('.stat-card').querySelector('h3').textContent.toLowerCase();
            if (statType.includes('courses')) {
                stat.textContent = progressData.coursesCompleted;
            } else if (statType.includes('hours')) {
                stat.textContent = progressData.hoursLearned;
            } else if (statType.includes('achievements')) {
                stat.textContent = progressData.achievements;
            }
        });

        // Update timeline progress
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            const progress = item.querySelector('.progress');
            const progressText = item.querySelector('.progress-text');
            let progressValue = 0;

            if (index === 0) progressValue = progressData.courseProgress.basics;
            else if (index === 1) progressValue = progressData.courseProgress.intermediate;
            else if (index === 2) progressValue = progressData.courseProgress.advanced;

            progress.style.width = `${progressValue}%`;
            progressText.textContent = `${progressValue}% Complete`;
        });

        // Update achievements
        achievementCards.forEach((card, index) => {
            if (progressData.achievements > index) {
                card.classList.remove('locked');
            }
        });
    }

    // Save progress to localStorage
    function saveProgress() {
        localStorage.setItem('pythonProProgress', JSON.stringify(progressData));
    }

    // Simulate progress updates (for demonstration)
    function simulateProgress() {
        progressData.coursesCompleted = Math.min(progressData.coursesCompleted + 1, 10);
        progressData.hoursLearned = Math.min(progressData.hoursLearned + 2, 50);
        progressData.achievements = Math.min(progressData.achievements + 1, 3);
        
        // Update course progress
        if (progressData.courseProgress.basics < 100) {
            progressData.courseProgress.basics = Math.min(progressData.courseProgress.basics + 20, 100);
        } else if (progressData.courseProgress.intermediate < 100) {
            progressData.courseProgress.intermediate = Math.min(progressData.courseProgress.intermediate + 20, 100);
        } else if (progressData.courseProgress.advanced < 100) {
            progressData.courseProgress.advanced = Math.min(progressData.courseProgress.advanced + 20, 100);
        }

        updateProgressDisplay();
        saveProgress();
    }

    // Add click event to simulate progress (for demonstration)
    const progressSection = document.querySelector('.progress-section');
    if (progressSection) {
        progressSection.addEventListener('click', function(e) {
            if (e.target.closest('.timeline-item') || e.target.closest('.achievement-card')) {
                simulateProgress();
            }
        });
    }
});

// Mark lesson as completed
function markLessonCompleted(lessonCard) {
    lessonCard.classList.add('completed');
    const startButton = lessonCard.querySelector('.start-lesson');
    startButton.textContent = 'Completed';
    startButton.disabled = true;
    updateProgress();
}

// Practice Exercise Validation
function validateExercise(lessonNumber, code) {
    const exercises = {
        1: {
            validate: (code) => code.includes('print('),
            message: 'Try using the print() function to display a message'
        },
        2: {
            validate: (code) => {
                const hasVariables = code.includes('=');
                const hasPrint = code.includes('print(');
                return hasVariables && hasPrint;
            },
            message: 'Create variables and print them'
        },
        3: {
            validate: (code) => {
                const hasIf = code.includes('if');
                const hasPrint = code.includes('print(');
                return hasIf && hasPrint;
            },
            message: 'Use if statements to check the number'
        }
    };

    const exercise = exercises[lessonNumber];
    if (exercise && exercise.validate(code)) {
        return true;
    }
    return false;
}

// Handle exercise completion
runButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        const lessonCard = button.closest('.lesson-card');
        const lessonNumber = lessonCard.dataset.lesson;
        const code = codeInputs[index].value;
        
        if (validateExercise(lessonNumber, code)) {
            markLessonCompleted(lessonCard);
        }
    });
});

// Mobile Navigation
let lastScroll = 0;
const mobileNav = document.querySelector('.mobile-nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        mobileNav.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !mobileNav.classList.contains('scroll-down')) {
        mobileNav.classList.remove('scroll-up');
        mobileNav.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && mobileNav.classList.contains('scroll-down')) {
        mobileNav.classList.remove('scroll-down');
        mobileNav.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Practice Categories
const practiceCategories = document.querySelectorAll('.category-btn');
const exercisesSections = document.querySelectorAll('.exercises-section');

practiceCategories.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and sections
        practiceCategories.forEach(b => b.classList.remove('active'));
        exercisesSections.forEach(s => s.classList.remove('active'));

        // Add active class to clicked button and corresponding section
        btn.classList.add('active');
        const category = btn.dataset.category;
        document.getElementById(`${category}-exercises`).classList.add('active');
    });
});

// Code Editor
let editor;
const editorModal = document.getElementById('editor-modal');
const closeModal = document.querySelector('.close-modal');
const startExerciseButtons = document.querySelectorAll('.start-exercise');
const exerciseTitle = document.getElementById('exercise-title');
const exerciseDescription = document.getElementById('exercise-description');
const exerciseRequirements = document.getElementById('exercise-requirements');
const runCodeButton = document.querySelector('.run-code');
const resetCodeButton = document.querySelector('.reset-code');
const outputConsole = document.getElementById('output');

// Initialize CodeMirror
document.addEventListener('DOMContentLoaded', () => {
    editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: 'python',
        theme: 'dracula',
        lineNumbers: true,
        indentUnit: 4,
        smartIndent: true,
        tabSize: 4,
        indentWithTabs: false,
        lineWrapping: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        extraKeys: {
            'Tab': 'indentMore',
            'Shift-Tab': 'indentLess'
        }
    });
});

// Exercise Data
const exercises = {
    'hello-world': {
        title: 'Hello World',
        description: 'Write a program that prints "Hello, World!" to the console.',
        requirements: [
            'Use the print() function',
            'The output should be exactly "Hello, World!"'
        ],
        template: '# Write your code here\nprint("Hello, World!")'
    },
    'calculator': {
        title: 'Calculator',
        description: 'Create a simple calculator that can perform basic arithmetic operations.',
        requirements: [
            'Support addition, subtraction, multiplication, and division',
            'Handle user input for numbers and operations',
            'Display the result'
        ],
        template: '# Write your calculator code here\n\n# Get user input\nnum1 = float(input("Enter first number: "))\noperator = input("Enter operator (+, -, *, /): ")\nnum2 = float(input("Enter second number: "))\n\n# Perform calculation\nif operator == "+":\n    result = num1 + num2\nelif operator == "-":\n    result = num1 - num2\nelif operator == "*":\n    result = num1 * num2\nelif operator == "/":\n    result = num1 / num2\nelse:\n    result = "Invalid operator"\n\n# Display result\nprint(f"Result: {result}")'
    },
    'number-guessing': {
        title: 'Number Guessing Game',
        description: 'Create a number guessing game where the computer picks a random number.',
        requirements: [
            'Generate a random number between 1 and 100',
            'Get user input for guesses',
            'Provide hints (higher/lower)',
            'Track number of attempts'
        ],
        template: 'import random\n\n# Generate random number\nnumber = random.randint(1, 100)\nattempts = 0\n\nprint("I\'m thinking of a number between 1 and 100.")\n\nwhile True:\n    guess = int(input("Enter your guess: "))\n    attempts += 1\n    \n    if guess < number:\n        print("Higher!")\n    elif guess > number:\n        print("Lower!")\n    else:\n        print(f"Correct! You took {attempts} attempts.")\n        break'
    }
};

// Open Exercise Modal
startExerciseButtons.forEach(button => {
    button.addEventListener('click', () => {
        const exerciseId = button.dataset.exercise;
        const exercise = exercises[exerciseId];
        
        if (exercise) {
            exerciseTitle.textContent = exercise.title;
            exerciseDescription.textContent = exercise.description;
            exerciseRequirements.innerHTML = exercise.requirements
                .map(req => `<li>${req}</li>`)
                .join('');
            
            editor.setValue(exercise.template);
            editorModal.classList.add('active');
        }
    });
});

// Close Modal
closeModal.addEventListener('click', () => {
    editorModal.classList.remove('active');
});

// Run Code
runCodeButton.addEventListener('click', () => {
    const code = editor.getValue();
    try {
        // In a real application, this would be handled by a backend service
        // For now, we'll just show a message
        outputConsole.textContent = 'Running code...\n\nNote: In a real application, this would execute the code on a server and show the actual output.';
    } catch (error) {
        outputConsole.textContent = `Error: ${error.message}`;
    }
});

// Reset Code
resetCodeButton.addEventListener('click', () => {
    const exerciseId = document.querySelector('.start-exercise.active')?.dataset.exercise;
    if (exerciseId && exercises[exerciseId]) {
        editor.setValue(exercises[exerciseId].template);
    }
});

// Topic Completion
function completeTopic(topicId) {
    const topicCard = document.querySelector(`[data-topic="${topicId}"]`);
    if (topicCard) {
        topicCard.classList.add('completed');
        updateProgress(topicId, 100);
        
        // Unlock next topic if available
        const nextTopic = topicCard.nextElementSibling;
        if (nextTopic && nextTopic.classList.contains('locked')) {
            nextTopic.classList.remove('locked');
            nextTopic.classList.add('unlocked');
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initialize CodeMirror
    editor.refresh();
});

// Learn Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tab Switching
    const tabs = document.querySelectorAll('.category-tabs .tab');
    const sections = document.querySelectorAll('.topics-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and sections
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Show corresponding section
            const category = this.getAttribute('data-category');
            const targetSection = document.getElementById(category);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Search Functionality
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const topicCards = document.querySelectorAll('.topic-card');

    function filterTopics(query) {
        query = query.toLowerCase();
        topicCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const isVisible = title.includes(query) || description.includes(query);
            card.style.display = isVisible ? 'block' : 'none';
        });
    }

    searchInput.addEventListener('input', (e) => {
        filterTopics(e.target.value);
    });

    searchBtn.addEventListener('click', () => {
        filterTopics(searchInput.value);
    });

    // Bookmark Functionality
    const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
    
    bookmarkButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const icon = btn.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
            
            // Add animation
            btn.classList.add('bookmark-animation');
            setTimeout(() => {
                btn.classList.remove('bookmark-animation');
            }, 300);
        });
    });

    // Progress Bar Animation
    const progressBars = document.querySelectorAll('.progress');
    
    function animateProgress(progressBar) {
        const targetWidth = progressBar.dataset.progress || '0';
        progressBar.style.width = targetWidth + '%';
    }

    // Animate progress bars when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                animateProgress(progressBar);
                observer.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => observer.observe(bar));

    // Learning Path Animation
    const pathSteps = document.querySelectorAll('.path-step');
    
    pathSteps.forEach((step, index) => {
        step.style.animationDelay = `${index * 0.2}s`;
        step.classList.add('animate-in');
    });
}); 

// Resources Page Navigation
document.addEventListener('DOMContentLoaded', function() {
    const resourceNavButtons = document.querySelectorAll('.resource-nav-btn');
    const resourceSections = document.querySelectorAll('.resource-section');

    // Handle URL hash on page load
    const hash = window.location.hash.slice(1);
    if (hash) {
        const targetSection = document.getElementById(hash);
        if (targetSection) {
            // Remove active class from all sections and buttons
            resourceSections.forEach(section => section.classList.remove('active'));
            resourceNavButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to target section and button
            targetSection.classList.add('active');
            const targetButton = document.querySelector(`[data-section="${hash}"]`);
            if (targetButton) {
                targetButton.classList.add('active');
            }
        }
    }

    // Handle navigation button clicks
    resourceNavButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.getAttribute('data-section');

            // Remove active class from all sections and buttons
            resourceSections.forEach(section => section.classList.remove('active'));
            resourceNavButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to target section and button
            document.getElementById(targetSection).classList.add('active');
            button.classList.add('active');

            // Update URL hash
            window.location.hash = targetSection;
        });
    });
});

// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.auth-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            const rememberMe = loginForm.querySelector('input[type="checkbox"]').checked;
            
            // For demo purposes, we'll accept any non-empty email and password
            if (email && password) {
                // Store login state
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                }
                
                // Redirect to home page
                window.location.href = 'index.html';
            } else {
                alert('Please enter both email and password');
            }
        });
    }

    // Social login buttons
    const googleBtn = document.querySelector('.social-btn.google');
    const githubBtn = document.querySelector('.social-btn.github');

    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            alert('Google login functionality will be implemented soon');
        });
    }

    if (githubBtn) {
        githubBtn.addEventListener('click', function() {
            alert('GitHub login functionality will be implemented soon');
        });
    }
});

// Check login status and update UI
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginBtn = document.querySelector('.auth-button');
    
    if (loginBtn) {
        if (isLoggedIn) {
            const userEmail = localStorage.getItem('userEmail');
            loginBtn.innerHTML = `<i class="fas fa-user"></i> ${userEmail}`;
            loginBtn.href = '#'; // Change to profile page when available
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // Logout functionality
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('rememberMe');
                window.location.reload();
            });
        } else {
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            loginBtn.href = 'login.html';
        }
    }
}

// Call checkLoginStatus when the page loads
document.addEventListener('DOMContentLoaded', checkLoginStatus);

// Learning Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Course Navigation Tabs
    const tabButtons = document.querySelectorAll('.course-nav-button');
    const tabContents = document.querySelectorAll('.course-tab');
    
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                
                // Remove active class from all buttons and tabs
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(tab => tab.classList.remove('active'));
                
                // Add active class to current button and tab
                this.classList.add('active');
                document.getElementById(`${tabName}-tab`).classList.add('active');
            });
        });
    }

    // Lesson Headers (Expand/Collapse)
    const lessonHeaders = document.querySelectorAll('.lesson-header');
    const lessonCards = document.querySelectorAll('.lesson-card');
    
    if (lessonHeaders.length > 0) {
        lessonHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const lessonCard = this.closest('.lesson-card');
                const lessonContent = lessonCard.querySelector('.lesson-content');
                
                // Close all other lessons first
                lessonCards.forEach(card => {
                    if (card !== lessonCard) {
                        const content = card.querySelector('.lesson-content');
                        if (content) content.classList.remove('active');
                    }
                });
                
                // Toggle current lesson
                if (lessonContent) {
                    lessonContent.classList.toggle('active');
                }
            });
        });
    }

    // Start Lesson Buttons
    const startButtons = document.querySelectorAll('.start-lesson');
    
    if (startButtons.length > 0) {
        startButtons.forEach(button => {
            button.addEventListener('click', function() {
                const content = this.closest('.lesson-card').querySelector('.lesson-content');
                if (content) {
                    if (content.style.display === 'none' || !content.style.display) {
                        content.style.display = 'block';
                        this.textContent = 'Hide Lesson';
                    } else {
                        content.style.display = 'none';
                        this.textContent = 'Start Lesson';
                    }
                }
            });
        });
    }

    // Code Playground Functionality
    const codePlaygrounds = document.querySelectorAll('.code-playground');
    
    if (codePlaygrounds.length > 0) {
        codePlaygrounds.forEach(playground => {
            const codeInput = playground.querySelector('.code-input');
            const runButton = playground.querySelector('.run-code');
            const output = playground.querySelector('.console-output');
            const resetButton = playground.querySelector('.reset-code');
            
            if (runButton && codeInput && output) {
                // Save default code if any
                const defaultCode = codeInput.value;
                
                runButton.addEventListener('click', function() {
                    const code = codeInput.value.trim();
                    
                    if (code === '') {
                        output.textContent = 'No code to run';
                        return;
                    }
                    
                    try {
                        // For educational purposes, we'll simulate code execution
                        // In a real app, you might use an API or web worker to run Python code
                        let result = simulateCodeExecution(code);
                        output.textContent = result;
                    } catch (error) {
                        output.textContent = `Error: ${error.message}`;
                    }
                });
                
                if (resetButton) {
                    resetButton.addEventListener('click', function() {
                        codeInput.value = defaultCode;
                        output.textContent = '';
                    });
                }
            }
        });
    }

    // Copy Code Button Functionality
    const copyButtons = document.querySelectorAll('.code-action');
    
    if (copyButtons.length > 0) {
        copyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const codeBlock = this.closest('.code-editor').querySelector('code');
                
                if (codeBlock) {
                    // Create a temporary textarea to copy text
                    const textarea = document.createElement('textarea');
                    textarea.value = codeBlock.textContent;
                    document.body.appendChild(textarea);
                    textarea.select();
                    
                    try {
                        document.execCommand('copy');
                        
                        // Visual feedback for copy
                        const originalText = this.innerHTML;
                        this.innerHTML = '<i class="fas fa-check"></i> Copied';
                        
                        setTimeout(() => {
                            this.innerHTML = originalText;
                        }, 2000);
                    } catch (err) {
                        console.error('Failed to copy text: ', err);
                    }
                    
                    document.body.removeChild(textarea);
                }
            });
        });
    }

    // Mark Complete Button Functionality
    const markCompleteButtons = document.querySelectorAll('.mark-complete');
    
    if (markCompleteButtons.length > 0) {
        markCompleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const lessonCard = this.closest('.lesson-card');
                const lessonNumber = lessonCard.getAttribute('data-lesson');
                
                // Store completion status in localStorage
                localStorage.setItem(`lesson_${lessonNumber}_complete`, 'true');
                
                // Visual feedback
                button.textContent = 'Completed';
                button.style.background = '#34a853';
                
                // Update overall course progress
                updateCourseProgress();
                
                // If there's a next lesson button, enable and focus it
                const nextButton = this.nextElementSibling;
                if (nextButton && nextButton.classList.contains('nav-button') && !nextButton.disabled) {
                    setTimeout(() => {
                        nextButton.focus();
                    }, 500);
                }
            });
        });
    }

    // Initialize course progress on page load
    updateCourseProgress();
});

// Helper function to update course progress
function updateCourseProgress() {
    const totalLessons = document.querySelectorAll('.lesson-card').length;
    let completedLessons = 0;
    
    // Count completed lessons from localStorage
    for (let i = 1; i <= totalLessons; i++) {
        if (localStorage.getItem(`lesson_${i}_complete`) === 'true') {
            completedLessons++;
            
            // Mark the lesson as completed in UI
            const lessonCard = document.querySelector(`.lesson-card[data-lesson="${i}"]`);
            if (lessonCard) {
                const completeButton = lessonCard.querySelector('.mark-complete');
                if (completeButton) {
                    completeButton.textContent = 'Completed';
                    completeButton.style.background = '#34a853';
                }
            }
        }
    }
    
    // Update progress bar and text
    const progressBar = document.querySelector('.course-progress .progress');
    const progressText = document.querySelector('.course-progress .progress-text');
    
    if (progressBar && progressText) {
        const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `${Math.round(progressPercentage)}% Complete`;
    }
}

// Function to simulate Python code execution (for demo purposes)
function simulateCodeExecution(code) {
    // This is a very simplified simulation and only handles basic print statements
    // In a real app, you'd use a proper Python interpreter or API
    
    let output = '';
    
    // Look for print statements
    const printRegex = /print\s*\(\s*["'](.+?)["']\s*\)/g;
    let printMatch;
    
    while ((printMatch = printRegex.exec(code)) !== null) {
        output += printMatch[1] + '\n';
    }
    
    // If no print statements were found
    if (output === '') {
        // If the code contains common Python syntax, acknowledge it
        if (code.includes('if') || code.includes('for') || code.includes('while') || code.includes('def')) {
            output = 'Code executed successfully (no output)';
        } else {
            // Try to evaluate simple expressions
            try {
                // This is unsafe in a real application but okay for our demo
                // For a real app, use a sandboxed environment or API
                const result = eval(code.replace('print', 'console.log'));
                if (result !== undefined) {
                    output = result.toString();
                } else {
                    output = 'Code executed successfully (no output)';
                }
            } catch (e) {
                output = 'Code executed successfully (no output)';
            }
        }
    }
    
    return output;
}

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        // Toggle between bars and times icon
        const icon = this.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-container')) {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
});

// Navbar scroll effect for logo visibility
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Hide navbar on scroll down, show on scroll up (debounced for performance)
let lastNavbarScroll = 0;
let navbarScrollTimeout;
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    clearTimeout(navbarScrollTimeout);
    navbarScrollTimeout = setTimeout(() => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > lastNavbarScroll && currentScroll > 50) {
            // Scrolling down
            navbar.classList.add('navbar-hide');
        } else {
            // Scrolling up
            navbar.classList.remove('navbar-hide');
        }
        lastNavbarScroll = currentScroll;
    }, 10);
}); 

// Progress Page Enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Personalized Welcome
    const welcomeMsg = document.getElementById('welcome-message');
    const userEmail = localStorage.getItem('pythonProUserEmail');
    if (userEmail && welcomeMsg) {
        welcomeMsg.textContent = `Welcome, ${userEmail}!`;
    }

    // Motivational Quotes (randomize)
    const quotes = [
        '"Learning never exhausts the mind." – Leonardo da Vinci',
        '"The beautiful thing about learning is nobody can take it away from you." – B.B. King',
        '"Success is the sum of small efforts, repeated day in and day out." – Robert Collier',
        '"The expert in anything was once a beginner." – Helen Hayes',
        '"Education is the most powerful weapon which you can use to change the world." – Nelson Mandela'
    ];
    const quoteElem = document.getElementById('motivational-quote');
    if (quoteElem) {
        quoteElem.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    }

    // Progress Data
    let progressData = {
        coursesCompleted: 0,
        hoursLearned: 0,
        achievements: 0,
        courseProgress: {
            basics: 0,
            intermediate: 0,
            advanced: 0
        },
        streak: 0,
        recentActivity: []
    };
    const savedProgress = localStorage.getItem('pythonProProgress');
    if (savedProgress) {
        progressData = { ...progressData, ...JSON.parse(savedProgress) };
    }
    // Streak (simulate for demo)
    if (!progressData.streak) {
        progressData.streak = Math.floor(Math.random() * 7) + 1;
    }

    // Update Overview
    document.getElementById('courses-completed').textContent = progressData.coursesCompleted;
    document.getElementById('hours-learned').textContent = progressData.hoursLearned;
    document.getElementById('achievements').textContent = progressData.achievements;
    document.getElementById('current-streak').textContent = progressData.streak + ' day' + (progressData.streak === 1 ? '' : 's');

    // Calculate overall progress
    const total = progressData.courseProgress.basics + progressData.courseProgress.intermediate + progressData.courseProgress.advanced;
    const overall = Math.round(total / 3);
    // Animate circular progress
    const circBar = document.getElementById('circular-bar');
    const circLabel = document.getElementById('circular-label');
    if (circBar && circLabel) {
        let progress = 0;
        const animate = () => {
            if (progress < overall) {
                progress++;
                circLabel.textContent = progress + '%';
                circBar.style.strokeDashoffset = 282.74 - (282.74 * progress / 100);
                requestAnimationFrame(animate);
            } else {
                circLabel.textContent = overall + '%';
                circBar.style.strokeDashoffset = 282.74 - (282.74 * overall / 100);
            }
        };
        animate();
    }

    // Timeline Progress
    const timelineSections = [
        { id: 'basics', label: 'Python Basics' },
        { id: 'intermediate', label: 'Intermediate Python' },
        { id: 'advanced', label: 'Advanced Python' }
    ];
    timelineSections.forEach(sec => {
        const prog = progressData.courseProgress[sec.id] || 0;
        const bar = document.getElementById('progress-' + sec.id);
        const text = document.getElementById('progress-text-' + sec.id);
        if (bar && text) {
            bar.style.width = prog + '%';
            text.textContent = prog + '% Complete';
        }
    });
    // Timeline clickable
    document.querySelectorAll('.timeline-item.clickable').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            if (section === 'basics') window.location.href = 'beginner.html';
            if (section === 'intermediate') window.location.href = 'courses.html#intermediate';
            if (section === 'advanced') window.location.href = 'courses.html#advanced';
        });
    });

    // Achievements
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach((card, idx) => {
        if (progressData.achievements > idx) {
            card.classList.remove('locked');
        } else {
            card.classList.add('locked');
        }
    });

    // Recent Activity
    const recentList = document.getElementById('recent-activity-list');
    if (recentList) {
        recentList.innerHTML = '';
        if (progressData.recentActivity && progressData.recentActivity.length > 0) {
            progressData.recentActivity.slice(-5).reverse().forEach(act => {
                const li = document.createElement('li');
                li.textContent = act;
                recentList.appendChild(li);
            });
        } else {
            recentList.innerHTML = '<li>No recent activity yet.</li>';
        }
    }
}); 

// BEGINNER PAGE INTERACTIVITY

document.addEventListener('DOMContentLoaded', function() {
    // Accordion for lesson cards
    const lessonCards = document.querySelectorAll('.lesson-card');
    const expandButtons = document.querySelectorAll('.expand-lesson');
    const lessonHeaders = document.querySelectorAll('.lesson-header.collapsible');
    const learningPathSteps = document.querySelectorAll('.learning-path-visual .path-step');

    function openLesson(card) {
        lessonCards.forEach((c, idx) => {
            if (c === card) {
                c.classList.add('active');
                // Highlight learning path
                learningPathSteps.forEach((step, sidx) => {
                    if (sidx === idx) step.classList.add('active');
                    else step.classList.remove('active');
                });
            } else {
                c.classList.remove('active');
            }
        });
    }

    expandButtons.forEach((btn, idx) => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            openLesson(lessonCards[idx]);
        });
    });
    lessonHeaders.forEach((header, idx) => {
        header.addEventListener('click', function() {
            openLesson(lessonCards[idx]);
        });
    });
    // Open first lesson by default
    if (lessonCards.length) openLesson(lessonCards[0]);

    // Show Solution button
    document.querySelectorAll('.show-solution').forEach((btn, idx) => {
        btn.addEventListener('click', function() {
            const solution = btn.nextElementSibling;
            if (solution.style.display === 'block') {
                solution.style.display = 'none';
                btn.textContent = 'Show Solution';
            } else {
                solution.style.display = 'block';
                btn.textContent = 'Hide Solution';
            }
        });
    });

    // Mark as Complete button
    document.querySelectorAll('.mark-complete').forEach((btn, idx) => {
        btn.addEventListener('click', function() {
            lessonCards[idx].classList.add('completed');
            // Show badge
            const badge = lessonCards[idx].querySelector('.lesson-complete-badge');
            if (badge) badge.style.display = 'inline-flex';
            // Toast notification
            let toast = document.querySelector('.toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.className = 'toast';
                document.body.appendChild(toast);
            }
            toast.textContent = 'Lesson marked as complete!';
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
        });
    });
}); 

// BEGINNER LESSON PROGRESSION

document.addEventListener('DOMContentLoaded', function() {
    const lessonCards = document.querySelectorAll('.lesson-card');
    const markCompleteButtons = document.querySelectorAll('.mark-complete');
    const startButtons = document.querySelectorAll('.start-lesson');

    // Load progress from localStorage
    let completedLessons = JSON.parse(localStorage.getItem('beginnerCompletedLessons') || '[]');

    // Initialize progress bar
    function updateProgressBar() {
        const totalLessons = lessonCards.length - 2; // Exclude quiz and control flow
        const completedCount = completedLessons.length;
        const progress = (completedCount / totalLessons) * 100;
        const progressBar = document.querySelector('.progress-bar-fill');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }

    // Show only the first lesson initially
    lessonCards.forEach((card, index) => {
        if (index === 0) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });

    // Handle start lesson button clicks
    startButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const lessonCard = this.closest('.lesson-card');
            const lessonContent = lessonCard.querySelector('.lesson-content');
            
            if (lessonContent) {
                // Toggle lesson content visibility with animation
                if (lessonContent.style.display === 'none' || !lessonContent.style.display) {
                    // Show content with animation
                    lessonContent.style.display = 'block';
                    lessonContent.style.opacity = '0';
                    lessonContent.style.transform = 'translateY(20px)';
                    
                    // Force reflow
                    lessonContent.offsetHeight;
                    
                    // Animate in
                    lessonContent.style.opacity = '1';
                    lessonContent.style.transform = 'translateY(0)';
                    this.textContent = 'Hide Lesson';
                } else {
                    // Hide content with animation
                    lessonContent.style.opacity = '0';
                    lessonContent.style.transform = 'translateY(20px)';
                    
                    // Wait for animation to complete before hiding
                    setTimeout(() => {
                        lessonContent.style.display = 'none';
                    }, 300);
                    
                    this.textContent = 'Start Lesson';
                }
            }
        });
    });

    // Mark lesson as complete and show next
    markCompleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lessonCard = this.closest('.lesson-card');
            const lessonNum = lessonCard.getAttribute('data-lesson');
            
            if (!completedLessons.includes(lessonNum)) {
                completedLessons.push(lessonNum);
                localStorage.setItem('beginnerCompletedLessons', JSON.stringify(completedLessons));
                
                // Add completion animation
                lessonCard.classList.add('completed');
                
                // Hide current lesson with fade out
                lessonCard.style.opacity = '0';
                lessonCard.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    lessonCard.classList.add('hidden');
                    
                    // Show next lesson with fade in
                    const nextCard = lessonCard.nextElementSibling;
                    if (nextCard && nextCard.classList.contains('lesson-card')) {
                        nextCard.classList.remove('hidden');
                        nextCard.style.opacity = '0';
                        nextCard.style.transform = 'translateY(20px)';
                        
                        // Trigger reflow
                        nextCard.offsetHeight;
                        
                        nextCard.style.opacity = '1';
                        nextCard.style.transform = 'translateY(0)';
                    }
                    
                    // Update progress
                    updateProgressBar();
                    
                    // Check if all lessons are complete
                    const allLessons = Array.from(lessonCards).filter(card => 
                        card.getAttribute('data-lesson') !== 'quiz' && 
                        card.getAttribute('data-lesson') !== '7'
                    );
                    
                    if (allLessons.every(card => completedLessons.includes(card.getAttribute('data-lesson')))) {
                        const quizCard = document.querySelector('.lesson-card[data-lesson="quiz"]');
                        if (quizCard) {
                            setTimeout(() => {
                                quizCard.classList.remove('hidden');
                                quizCard.style.opacity = '0';
                                quizCard.style.transform = 'translateY(20px)';
                                
                                // Trigger reflow
                                quizCard.offsetHeight;
                                
                                quizCard.style.opacity = '1';
                                quizCard.style.transform = 'translateY(0)';
                            }, 500);
                        }
                    }
                }, 300);
            }
        });
    });

    // Initialize progress bar
    updateProgressBar();

    // Add hover effects for lesson cards
    lessonCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('locked')) {
                this.style.transform = 'translateY(-5px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('locked')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
}); 