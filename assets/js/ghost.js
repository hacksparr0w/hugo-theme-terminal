const ALPHABET = (
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890~`!@#$%^&*" +
  "()_-+={[}]:;\"'|\\<,>.?/"
);

const removeElements = (array, elements) => (
  array.filter(other => !elements.includes(other))
);

const removeElementAt = (array, index) => (
  array.filter((_, other) => other !== index)
);

const sleep = timeout => new Promise(resolve => {
  setTimeout(resolve, timeout);
});

const getRandomInteger = (from, to) => (
  from + Math.round(Math.random() * (to - from - 1))
);

const chooseRandomElement = array => {
  if (array.length === 0) {
    return undefined;
  }

  return array[getRandomInteger(0, array.length)];
};

const chooseRandomElements = (array, n) => {
  let source = array;
  const result = Array(n).fill();

  for (let i = 0; i < n; i += 1) {
    if (source.length === 0) {
      result.push(undefined);
    } else {
      const index = getRandomInteger(0, source.length);

      result.push(source[index]);
      source = removeElementAt(source, index);
    }
  }

  return result;
};

const ghostEffect = async element => {
  const originalHtml = element.innerHTML;
  const originalText = element.innerText;
  let currentText = "";

  const update = () => { element.innerText = currentText; };
  const finish = () => { element.innerHTML = originalHtml; };

  let step = 0;
  let alphabet = ALPHABET.split("");

  for (;;) {
    if (currentText === "") {
      currentText = originalText.split("")
        .map(x => x === " " ? " " : chooseRandomElement(alphabet))
        .join("");
    } else {
      const difference = originalText.split("")
        .filter((x, i) => x !== currentText.charAt(i));

      alphabet = removeElements(
        alphabet,
        chooseRandomElements(
          alphabet.filter(x => !difference.includes(x)),
          step
        )
      );

      currentText = currentText.split("")
        .map((x, i) => (
          x === originalText.charAt(i) ? x : chooseRandomElement(alphabet)
        ))
        .join("");
    }

    if (currentText === originalText) {
      finish();
      return;
    }

    step += 1;
    update();
    await sleep(60);
  }
};

const main = () => (
  document.querySelectorAll("p.ghost")
    .forEach(ghostEffect)
);

main();
