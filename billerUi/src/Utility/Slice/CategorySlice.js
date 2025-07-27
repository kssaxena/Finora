import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchData } from "../FetchFromApi";

// Define the fetchCategories thunk
export const fetchCategories = createAsyncThunk(
  "categoryList/fetchCategories",
  async () => {
    try {
      const response = await FetchData(
        "categories/get-all-category-and-subcategories",
        "get"
      ); // Replace with your API URL

      // console.log(response);
      // if (response.statusText != "OK") {
      //   throw new Error("Failed to fetch categories");
      // }
      return response.data.data.categories; // Assuming the API returns a list of categories
    } catch (err) {
      console.error(err);
      return ["got an error"];
    }
  }
);

const CategoryList = createSlice({
  name: "categoryList",
  initialState: {
    categories: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    addCategory: (state, action) => {
      if (!state.categories.includes(action.payload)) {
        state.categories.push(action.payload);
      }
    },
    removeCategory: (state, action) => {
      state.categories = state.categories.filter(
        (category) => category !== action.payload
      );
    },
    updateCategory: (state, action) => {
      const { oldCategory, newCategory } = action.payload;
      const index = state.categories.findIndex(
        (category) => category === oldCategory
      );
      if (index !== -1) {
        state.categories[index] = newCategory;
      }
    },
    resetCategories: (state) => {
      state.categories = [];
    },

    GetVerifiedCategories: (state) => {
      const VerifiedCategories = state.categories.filter(
        (category) => category.status === "verified"
      );
      return VerifiedCategories;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload; // Populate categories with fetched data
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addCategory, removeCategory, updateCategory, resetCategories } =
  CategoryList.actions;

export default CategoryList.reducer;
