const debounce = (fn, debounceTime) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, debounceTime);
  };
};

const searchInput = document.querySelector(".search-input");
const wrapper = document.querySelector(".wrapper");
const ul = document.createElement("ul");
ul.className = "list";
wrapper.append(ul);
const resultsList = document.querySelector(".results-list");

async function search() {
  return await fetch(
    `https://api.github.com/search/repositories?q=${searchInput.value}`
  ).then((res) => {
    if (res.ok) {
      const elements = wrapper.getElementsByClassName("repo-name");
      if (elements) {
        while (elements[0]) {
          elements[0].parentNode.removeChild(elements[0]);
        }
      }
      res.json().then((res) => {
        res.items.splice(5);
        res.items.forEach((repo) => {
          const element = document.createElement("li");
          element.className = "repo-name";
          element.textContent = `${repo.name}`;
          ul.append(element);
        });

        ul.onclick = function (event) {
          let target = event.target;
          let text = target.textContent;
          res.items.forEach((item) => {
            if (item.name === text) {
              const result = document.createElement("li");
              result.className = "result";
              resultsList.append(result);
              const info = document.createElement("div");
              info.className = "info";
              result.append(info);
              const resName = document.createElement("div");
              resName.textContent = `Name: ${item.name}`;
              info.append(resName);
              const resLog = document.createElement("div");
              resLog.textContent = `Owner: ${item.owner.login}`;
              info.append(resLog);
              const stars = document.createElement("div");
              stars.textContent = `Stars: ${item.stargazers_count}`;
              info.append(stars);
              const close = document.createElement("button");
              close.className = "close";
              result.append(close);
              close.addEventListener("click", (e) => {
                let del = e.target.closest(".result");
                del.remove();
              });
              searchInput.value = null;
              const elements = wrapper.getElementsByClassName("repo-name");
              if (elements) {
                while (elements[0]) {
                  elements[0].parentNode.removeChild(elements[0]);
                }
              }
            }
          });
        };
      });
    } else {
      const elements = wrapper.getElementsByClassName("repo-name");
      if (elements) {
        while (elements[0]) {
          elements[0].parentNode.removeChild(elements[0]);
        }
      }
    }
  });
}

const debouncedFn = debounce(search, 50);
searchInput.addEventListener("keyup", debouncedFn);
