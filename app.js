let category_data = null;
let cur_category = "All";
let cur_category_id = 1000;
let videos = [];

function get_categories() {
  fetch(`https://openapi.programming-hero.com/api/videos/categories`)
    .then((res) => res.json())
    .then((categories) => {
      displayData(categories);
      category_data = categories;
    })
    .catch((err) => console.log(err));
}

function get_videos(categoryId) {
  fetch(
    `https://openapi.programming-hero.com/api/videos/category/${categoryId}`
  )
    .then((res) => res.json())
    .then((data) => {
      display_videos(data);
      videos = data;
    })
    .catch((err) => console.log(err));
}

function secondsToHoursMinutes(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return { hours, minutes };
}

function stringToNumber(str) {
  return parseFloat(str.slice(0, str?.length));
}

function sortByViews(data) {
  console.log("from here", data);
  const sortedData = [...data.data];
  console.log("before", sortedData);
  sortedData.sort((a, b) => {
    // Extract the view counts as numbers
    const viewA = stringToNumber(a?.others?.views);
    const viewB = stringToNumber(b?.others?.views);

    return viewB - viewA;
  });
  console.log("after", sortedData);

  return sortedData;
}

const displayData = (categories) => {
  console.log(categories);
  const categoryContainer = document.querySelector("#cat-container");
  categoryContainer.innerHTML = "";
  categories.data.map((category) => {
    console.log(category);
    const button = document.createElement("button");
    if (cur_category == category.category)
      button.classList.add("btn", "btn-danger", "btn-sm");
    else button.classList.add("btn", "btn-secondary", "btn-sm");
    button.textContent = category.category;
    categoryContainer.appendChild(button);
  });
  get_videos(cur_category_id);
};

const sortBtn = document.getElementById("sort-btn");
const display_videos = (videos) => {
  console.log(videos.data);
  const videosContainer = document.getElementById("video-llist");
  const errorContainer = document.getElementById("error");

  if (videos?.data?.length <= 0) {
    sortBtn.style.display = "none";
    videosContainer.innerHTML = "";
    errorContainer.innerHTML = `<div class="d-flex flex-column align-items-center justify-content-center">
         <img src="images/Icon.png" alt="" />
        <h2 class="w-md-50">Oops!! Sorry, There is no content here</h2>
      </div>`;
  } else {
    sortBtn.style.display = "inline-block";
    videosContainer.innerHTML = "";
    errorContainer.innerHTML = "";
    videos.data.forEach((d) => {
      const videoItem = document.createElement("div");
      videoItem.classList.add("col");
      let time = null;
      if (d.others.posted_date) {
        time = secondsToHoursMinutes(d.others.posted_date);
      }

      videoItem.innerHTML = `
        <div class="card border-0">
            <div class="position-relative overflow-hidden">
            <img src="${
              d.thumbnail
            }" class="card-img-top" style="height:120px;object-fit:cover; border-radius:5px;" alt="..." />
            ${
              d.others.posted_date
                ? ` <p class="bg-black text-white position-absolute bottom-0 end-0 m-2 px-1" style="font-size:10px">${time.hours} hours ${time.minutes}mins ago</p>`
                : ""
            }
            
            </div>
            <div class="card-body g-0 py-1 px-0 d-flex justify-content-between">
              <div class="col-2 d-flex">
                <img src="${
                  d.authors[0].profile_picture
                }" style="object-fit:cover; width:30px;height:30px; border-radius:50%;"  alt="" />
              </div>
              <div class="col-10">
                <p style="font-weight:500;font-size:14px" class="card-title small mb-0">${
                  d.title
                }</p>
                <div class="d-flex align-items-center gap-1 py-0">
                  <p style="font-size:10px" class="card-text text-secondary small m-0 p-0">${
                    d.authors[0].profile_name
                  }</p>
                  ${
                    d.authors[0].verified
                      ? `<img style="height:12px;width:12px;display:block; margin-auto"  src="images/verified.png" alt="" />`
                      : ""
                  }
                </div>
                <p style="font-size:10px" class="card-text text-secondary small m-0 p-0">${
                  d.others.views
                } views</p>
                
              </div>
            </div>
        </div>
    `;
      videosContainer.appendChild(videoItem);
    });
  }
};

const catContainer = document.getElementById("cat-container");

catContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const clickedButton = e.target;
    const buttonText = clickedButton.textContent;
    cur_category_id = category_data.data.find(
      (cat) => cat.category === buttonText
    ).category_id;
    cur_category = buttonText;
    displayData(category_data);
  }
});

sortBtn.addEventListener("click", (e) => {
  const result = sortByViews(videos);
  const sortedVideos = {
    data: result,
  };
  console.log("sorted 157", sortedVideos);
  display_videos(sortedVideos);
});

// Call the function after script loads (not entire page)
window.addEventListener("DOMContentLoaded", get_categories);
