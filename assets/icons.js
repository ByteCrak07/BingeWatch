const iconList = [
  "fas fa-otter",
  "fas fa-hippo",
  "fas fa-dog",
  "fas fa-kiwi-bird",
  "fas fa-horse",
  "fas fa-fish",
  "fas fa-crow",
  "fas fa-cat",
  "fas fa-dragon",
  "fas fa-dove",
  "fas fa-frog",
  "fas fa-baby",
  "fas fa-pepper-hot",
  "fas fa-lemon",
  "fas fa-carrot",
  "fab fa-linux",
  "fab fa-suse",
  "fas fa-egg",
  "fas fa-ice-cream",
];

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

shuffleArray(iconList);

module.exports = { iconList, iconLen: iconList.length };
