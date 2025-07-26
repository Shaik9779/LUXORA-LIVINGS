const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const { isLoggedIn } = require("./middlewares");

// INDEX Route - Show all listings
router.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

// NEW Route - Show form to create listing (protected)
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

// CREATE Route - Save new listing (protected)
router.post("/", isLoggedIn, async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
});

// ✅ FIXED: Move this above the /:id route
router.get("/search", async (req, res) => {
    try {
        const { q, price, amenity, includeTax } = req.query;

        let query = {};

        if (q) {
            query.$or = [
                { title: new RegExp(q, "i") },
                { location: new RegExp(q, "i") }
            ];
        }

        if (price) {
            query.price = { $lte: parseInt(price) };
        }

        if (amenity) {
            query.amenities = { $in: [amenity] };
        }

        let listings = await Listing.find(query);

        if (includeTax === "on") {
            listings = listings.map((listing) => {
                const taxRate = 0.12;
                const priceWithTax = listing.price + listing.price * taxRate;
                return {
                    ...listing._doc,
                    price: Math.round(priceWithTax),
                    taxIncluded: true
                };
            });
        }

        res.render("listings/index", { allListings: listings });
    } catch (err) {
        console.error("Search failed:", err);
        res.status(500).send("Something went wrong during search");
    }
});

// SHOW Route - Show one listing
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    res.render("listings/show", { listing });
});

// EDIT Route
router.get("/:id/edit", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

// UPDATE Route
router.put("/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
});

// DELETE Route
router.delete("/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
});

module.exports = router;
