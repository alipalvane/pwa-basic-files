if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
} else {
  console.log("not support PWA in this browser");
}


const fetchCourses = async ()=>{
  const res = await fetch('https://fakestoreapi.com/products?limit=4')
  const data = await res.json();
  return data
}
const createUi = (items)=>{
  const courseParent = document.querySelector("#course-parent")
  items.forEach(element => {
    courseParent.insertAdjacentHTML('beforeend',`
    <p>${element.title}</p>
    `)
  });
}
window.addEventListener('load', async ()=>{
  const courses = await fetchCourses()
  createUi(courses)
})