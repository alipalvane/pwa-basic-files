const webpush = require('web-push');
const {urlBase64ToUint8Array} = require("./baseToUnit")

const vapidKeys = webpush.generateVAPIDKeys();

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

const NotifPermissionState = async () => {
  if (navigator.permissions) {
    let result = await navigator.permissions.query({ name: "notifications" });
    return result.state;
  }
};

const showNotification = () => {
  // WAY 1
  // with this WAY we dont cant access to notifications in PWA or service worker
  // new Notification("Notification Title", {
  //   //options of notifications for 'actions/ body/ image / vibrate and ......'
  //   body: "Notification Body",
  // });

  //WAY 2
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((sw) => {
      sw.showNotification("Notification Title from SW (PWA)", {
        body: "notification body",
        title: "title of notif",
        tag: "notif-message",
        vibrate: [100, 50, 100],
        //for controls of actions we declear functions in service worker 'sw.js'
        actions: [
          { action: "confirm", title: "Accept" },
          { action: "cancel", title: "Cancel" },
        ],
      });
    });
  }
};

// If we want know that user give to us access notifications or not access use this
const getCurrentPushSub = async () =>{
  const sw = await navigator.serviceWorker.ready
  return await sw.pushManager.getSubscription()

}

// PUSH NOTIFICATION
// first we must create Push Subscription
const getPushSubscription = async () => {
  if ("serviceWorker" in navigator) {
    const sw = await navigator.serviceWorker.ready;
    const pushSubscription = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      //for security of notification from server for local work we can use web-push library instead backend key
      // and we nedd privateKey that we must give that to backend developer
      // we use library Base64ToArray because only accepet Buffer
      applicationServerKey: urlBase64ToUint8Array(vapidKeys.publicKey),
    });
  } else {
    console.log("Your Browser not support Push Notification");
  }
};

// NOTIFICATION
const getNotificationPermission = async () => {
  // WAY 1 :
  Notification.requestPermission().then((result) => {
    if (result === "granted") {
      showNotification();
      //handle access push notification in user access control
      getPushSubscription();
      //say to us that user give to us access to notif or not from past time
      getCurrentPushSub()
      console.log("user accept permission");
    } else if (result === "denied") {
      console.log("user dont accept permission");
    }
    //if result was 'granted' => as ✅
    //if result was 'denied' => as ❌
  });

  // WAY 2 :
  //const notificationPermission = Notification.requestPermission();

  // WAY 3 :
  //const notifPermission = await NotifPermissionState();
};

addNewCourseBtn.addEventListener("click", addNewCourse);

window.addEventListener("load", async () => {
  const courses = await fetchCourses();
  getNotificationPermission();
  createUi(courses);
});
