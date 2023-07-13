window.addEventListener('DOMContentLoaded', () => {
    //Tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }


    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target === item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });
    //slider
    const slider = tns({
        container: '.carousel__inner',
        preventScrollOnTouch: 'force',
        items: 2,
        slideBy: 2,
        rewind: true,
        controls: false,
        nav: false,
        responsive: {
            320: {
                slideBy: 1,
                items: 1,
            },
            640: {
                slideBy: 1,
                items: 1,
                edgePadding: 20,
                gutter: 20
            },
            700: {
                items: 1,
                gutter: 30
            },
            900: {
                items: 2
            }
        }
    });
    document.querySelector('.prev').addEventListener('click', function () {
        slider.goTo('prev');
    });

    document.querySelector('.next').addEventListener('click', function () {
        slider.goTo('next');
    });

    //burger

    const menu = document.querySelector('.header__menu'),
        menuItem = document.querySelectorAll('.header__item'),
        hamburger = document.querySelector('.hamburger');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('hamburger_active');
        menu.classList.toggle('header__menu_active');
    });

    menuItem.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.toggle('hamburger_active');
            menu.classList.toggle('header__menu_active');
        });
    });

    //timer
const date = new Date();
let deadline = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + (date.getDate()+1);
    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((t / (1000 * 60)) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                getTimeRemaining(endtime);
            }
        }

    }
    setClock('.timer', deadline);

    // Modal

    const modalTrigger = document.querySelector('[data-modal]'),
        modal = document.querySelector('.modal');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
        window.removeEventListener('scroll', showModalByScroll);
    }

    modalTrigger.addEventListener('click', openModal);

    function closeModal() {
        modal.classList.remove('show');
        modal.classList.add('hide');
        document.body.style.overflow = '';
    }

    modal.addEventListener('click', (e) => {
        const target = e.target;
        if (target === modal || target.getAttribute('data-close') == '') {
            closeModal();
        }
    })

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 15000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= 0.98 * document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll)
        }
    }
    window.addEventListener('scroll', showModalByScroll);

    // Telegram

    let form = document.querySelector('#form');

    let bot = {
        TOKEN: '6359534710:AAG3djMoTcE8fpCgXeM9QEVMkWivhyGMJy0',
        chatID: '-723546645'
    };

    const message = {
        loading: 'image/form/spinner.svg',
        success: 'Заявка успешно отправлена! Скоро мы с вами свяжемся',
        failure: 'Ошибка отправки! Воспользуйтесь мессенджером или СМС'
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const statusMessage = document.createElement('img');
        statusMessage.src = message.loading;
        statusMessage.classList.add('show');
        form.append(statusMessage);



        const formData = new FormData(form),
            response = Object.fromEntries(formData.entries());

        const messageTelegram = async (url) => {
            const res = await fetch(url, {
                method: "GET",
            });

            return res;
        };

        messageTelegram(`https://api.telegram.org/bot${bot.TOKEN}/sendMessage?chat_id=${bot.chatID}&text=name: ${response.name}; 
    phone: ${response.phone};`)
            .then((data) => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset();
            });

            function showThanksModal(message) {
                const prevModalDialog = document.querySelector('.modal__dialog');

                prevModalDialog.classList.remove('show');
                prevModalDialog.classList.add('hide');
    
                const thanksModal = document.createElement('div');
                thanksModal.classList.add('modal__dialog');
                thanksModal.innerHTML = `
            <div class="modal__content">
                <div data-close class="modal__close">&times;</div>
                <div class="modal__title">${message}</div>
            </div>
            `;
    
            document.querySelector('.modal').append(thanksModal);
            setTimeout(() => {
                thanksModal.remove();
                prevModalDialog.classList.remove('hide');
                prevModalDialog.classList.add('show');
                closeModal();
            }, 5000);
            }
    });

    // Smooth scroll and pageup

    const pageup = document.querySelector('.pageup');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 1920) {
            pageup.classList.add('show');
            pageup.classList.remove('hide');
        } else {
            pageup.classList.remove('show');
            pageup.classList.add('hide');
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });












});