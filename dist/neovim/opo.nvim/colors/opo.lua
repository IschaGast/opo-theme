vim.cmd("hi clear")
vim.g.colors_name = "opo"
require("opo").setup({
  style = vim.o.background == "dark" and "dark" or "light",
})
