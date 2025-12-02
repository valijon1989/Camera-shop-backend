console.log("Users frontend javascript file");

$(function () {
  $(".member-status").on("change", function (e) {
    const id = e.target.id,
      memberStatus = $(`#${id}.member-status`).val();

    //updateChoosenUser
    axios
      .post("/admin/user/edit", {
        _id: id,
        memberStatus: memberStatus,
      })
      .then((responce) => {
        console.log("responce:", responce);
        const result = responce.data;
        console.log("responce.data:", responce.data);

        if (result.data) {
          $(".member-status").blur();
        } else alert("User update faled!");
      })
      .catch((err) => {
        console.log(err);
        alert("User update faled!");
      });
  });

  $(".block-user").on("click", function () {
    const id = $(this).data("id");
    $(`#${id}.member-status`).val("BLOCK").trigger("change");
  });

  $(".delete-user").on("click", function () {
    const id = $(this).data("id");
    if (!confirm("Delete this member?")) return;
    $(`#${id}.member-status`).val("DELETE").trigger("change");
    $(this).closest("tbody").remove();
  });
});
