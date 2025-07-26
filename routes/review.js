const express = require("express");
// ✅ Important: mergeParams allows access to :id from parent route (/listings/:id/reviews)
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing");
const Review = require("../models/review");
const { isLoggedIn } = require("./middlewares");

// ✅ POST /listings/:id/reviews - Create a new review
router.post("/", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  // ✅ Check if listing exists
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  const { rating, comment } = req.body.review;

  const review = new Review({
    rating,
    comment,
    author: req.user._id,
  });

  listing.reviews.push(review);

  await review.save();
  await listing.save();

  req.flash("success", "Review added successfully!");
  res.redirect(`/listings/${listing._id}`);
});

// ✅ DELETE /listings/:id/reviews/:reviewId - Delete a review
router.delete("/:reviewId", isLoggedIn, async (req, res) => {
  const { id, reviewId } = req.params;

  // ✅ Remove the review reference from listing
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // ✅ Delete the review document
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted successfully!");
  res.redirect(`/listings/${id}`);
});

module.exports = router;
