import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { notificationsApi } from "../../lib/api";

export const fetchNotifications = createAsyncThunk(
  "notification/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      return await notificationsApi.list(params);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load notifications");
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "notification/markRead",
  async (id, { rejectWithValue }) => {
    try {
      await notificationsApi.markRead(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to mark notification as read");
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  "notification/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      await notificationsApi.markAllRead();
    } catch (err) {
      return rejectWithValue(err.message || "Failed to mark all as read");
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notification/delete",
  async (id, { rejectWithValue }) => {
    try {
      await notificationsApi.remove(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to delete notification");
    }
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.items || [];
        state.unreadCount = action.payload.unread_count ?? 0;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notif = state.notifications.find((n) => n.id === action.payload);
        if (notif && !notif.is_read) {
          notif.is_read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => {
          n.is_read = true;
        });
        state.unreadCount = 0;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const wasUnread = state.notifications.find((n) => n.id === action.payload && !n.is_read);
        state.notifications = state.notifications.filter((n) => n.id !== action.payload);
        if (wasUnread) state.unreadCount = Math.max(0, state.unreadCount - 1);
      });
  },
});

export default notificationSlice.reducer;
