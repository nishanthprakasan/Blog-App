const fs = require("fs").promises;
const path = require("path");
const Blog = require("../models/blog");

async function createBlog(req, res) {
  return res.render("blog", { user: req.user });
}

async function postBlog(req, res) {
  try {
    const { title, content, tags } = req.body;

    let coverImageURL = "";
    if (req.file) {
      coverImageURL = `/uploads/${req.file.filename}`;
    }

    const newBlog = await Blog.create({
      title,
      content,
      coverImage: coverImageURL,
      author: req.user._id,
      authorName: req.user.fullName,
      tags: tags ? tags.split(",") : [],
    });
    res.redirect("/home?alert=success");
  } catch (error) {
    console.error("Blog creation error:", error);
    res.render("blog/create", {
      error: "Error creating blog",
      user: req.user,
    });
  }
}

async function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    res.json({
      success: true,
      imageUrl: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    res.status(500).json({ error: "Image upload failed" });
  }
}

async function getBlogbyId(req, res) {
  try {
    const blogid = req.params.blogid;
    const blog = await Blog.find({ _id: blogid });
    if (!blog) {
      return res.status(404).render("error", { error: "Blog not found" });
    }
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogid,
      { $inc: { views: 1 } },
      { new: true }
    );
    return res.render("blogById", { user: req.user, blog: blog[0] });
  } catch (error) {
    res.status(500).json({ error: "Access denied." });
  }
}

async function myBlogs(req, res) {
  try {
    const blogs = await Blog.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    return res.render("myblogs", { user: req.user, blogs: blogs });
  } catch (error) {
    res.status(500).json({ error: "Unable to load your blogs." });
  }
}

async function editBlog(req, res) {
  try {
    const blogid = req.params.blogid;
    const blog = await Blog.findById(blogid);

    if (!blog) {
      return res.status(404).render("404");
    }

    if (req.user._id.toString() !== blog.author.toString()) {
      return res.status(403).render("error", { error: "Access denied" });
    }

    return res.render("edit", {
      user: req.user,
      blog: blog,
    });
  } catch (error) {
    console.error("Edit blog error:", error);
    return res.status(500).render("error");
  }
}

async function updateBlog(req, res) {
  try {
    const blogId = req.params.blogid;
    const { title, content, tags, removeCoverImage } = req.body;

    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return res.status(404).render("error", { error: "Blog not found" });
    }

    if (req.user._id.toString() !== existingBlog.author.toString()) {
      return res.status(403).render("error", { error: "Access denied" });
    }

    const updateData = {
      title,
      content,
      tags: tags
        ? tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag)
        : [],
      updatedAt: new Date(),
    };

    if (req.file) {
      updateData.coverImage = `/uploads/${req.file.filename}`;

      if (existingBlog.coverImage && existingBlog.coverImage.length > 0) {
        const oldImagePath = path.join("public", existingBlog.coverImage);
        const newImagePath = path.join("public", updateData.coverImage);

        if (oldImagePath !== newImagePath) {
          try {
            await fs.unlink(oldImagePath);
          } catch (fsError) {
            console.log("Could not delete old image:", fsError.message);
          }
        }
      }
    } else if (removeCoverImage === "on") {
      updateData.coverImage = "";

      if (existingBlog.coverImage && existingBlog.coverImage.length > 0) {
        const oldImagePath = path.join("public", existingBlog.coverImage);
        try {
          await fs.unlink(oldImagePath);
        } catch (fsError) {
          console.log("Could not delete old image:", fsError.message);
        }
      }
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateData, {
      new: true,
      runValidators: true,
    });
    return res.redirect("/blog/myblogs");
  } catch (error) {
    console.error("Update blog error:", error);
    return res.redirect("/blog/myblogs");
  }
}

async function deleteBlogById(req, res) {
  try {
    const blogid = req.params.blogid;
    console.log(blogid);
    const blog = await Blog.findById(blogid);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    if (req.user._id.toString() !== blog.author.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }
    if (blog.coverImage && blog.coverImage.length > 0) {
      const oldImagePath = path.join("public", blog.coverImage);
      try {
        await fs.unlink(oldImagePath);
      } catch (fsError) {
        console.log("Error:", fsError.message);
      }
    }
    await Blog.findByIdAndDelete(blogid);
    return res.redirect("/blog/myblogs");
  } catch (error) {
    console.error("Delete blog error:", error);
    return res.status(500).json({ error: "Error deleting blog" });
  }
}

module.exports = {
  createBlog,
  postBlog,
  uploadImage,
  getBlogbyId,
  myBlogs,
  editBlog,
  updateBlog,
  deleteBlogById,
};
