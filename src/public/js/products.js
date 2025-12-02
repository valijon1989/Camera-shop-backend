console.log("Products frontend javascript file");
$(function () {
  $("#process-btn").on("click", () => {
    $(".dish-container").slideToggle(500);
    $("#process-btn").css("display", "none");
  });

  $("#cancel-btn").on("click", () => {
    $(".dish-container").slideToggle(100);
    $("#process-btn").css("display", "flex");
  });

  $(".new-product-status").on("change", async function (e) {
    const id = e.target.id,
      productStatus = $(`#${id}.new-product-status`).val();
    try {
      const responce = await axios.post(`/admin/product/${id}`, {
        productStatus: productStatus,
      });
      console.log("response:", responce);
      const result = responce.data;
      if (result.data) {
        $(".new-product-status").blur();
      } else {
        alert("Product update failed!");
      }
    } catch (err) {
      console.log(err);
      alert("Product update faled");
    }
  });

  $(".delete-product").on("click", async function () {
    const id = $(this).data("id");
    if (!confirm("Delete this product?")) return;
    try {
      const res = await axios.post(`/admin/product/${id}`, {
        productStatus: "DELETE",
      });
      if (res.data && res.data.data) {
        // remove row visually
        $(this).closest("tbody").remove();
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  });
});

function validateForm() {
  const cameraModel = $(".product-name").val(),
    productStatus = $(".product-status").val(),
    price = $(".product-price").val(),
    stock = $(".product-left-count").val(),
    brand = $("input[name='brand']").val(),
    category = $("select[name='category']").val(),
    description = $(".product-desc").val();

  if (
    cameraModel === "" ||
    productStatus === "" ||
    price === "" ||
    stock === "" ||
    brand === "" ||
    category === "" ||
    description === ""
  ) {
    alert("Please insert all details!");
    return false;
  } else return true;
}

function previewFileHandler(input, order) {
  const imgClassName = input.className;
  console.log("input:", input);

  const file = $(`.${imgClassName}`).get(0).files[0],
    fileType = file["type"],
    validImageType = ["image/jpg", "image/jpeg", "image/png"];

  if (!validImageType.includes(fileType)) {
    alert("Please insert only jpg, jpeg and png!");
  } else {
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        $(`#image-section-${order}`).attr("src", reader.result);
      };
      reader.readAsDataURL(file);
    }
  }
}
