console.log("Hi, I'm an hamburger");

document.querySelector('.hamburger')?.addEventListener('click', () => {
  document.querySelector('.hamburger')?.classList.toggle('expanded');
});
