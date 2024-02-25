const addNewCourseBtn = document.querySelector(".add-course");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
} else {
  console.log("not support PWA in this browser");
}

const fetchCourses = async () => {
  const res = await fetch("https://fakestoreapi.com/products?limit=4");
  const data = await res.json();
  return data;
};
const createUi = (items) => {
  const courseParent = document.querySelector("#course-parent");
  items.forEach((element) => {
    courseParent.insertAdjacentHTML(
      "beforeend",
      `
    <p>${elemenyout.title}</p>
    `
    );
  });
};

const addNewCourse = () => {
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    navigator.serviceWorker.ready((sw) => {
      return sw.sync
        .register("add-newn-course")
        .then(() => console.log("course added successfully"))
        .catch((err) => console.log(err));
    });
  } else {
    //
  }
};

addNewCourseBtn.addEventListener("click", addNewCourse);

window.addEventListener("load", async () => {
  const courses = await fetchCourses();
  createUi(courses);
});
