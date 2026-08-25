import { createSlice } from "@reduxjs/toolkit";
const initialNotifications = [
  {
    id: "notif_1",
    title: "Account Created",
    message: "Welcome to Tuinue Wasichana! Your account has been successfully created. Thank you for joining our mission to empower girls.",
    type: "account",
    time_ago: "Just now",
    read: false,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "notif_2",
    title: "Donation Successful",
    message: "Thank you! Your donation of Ksh 2,500 to the Heshima Project has been received. Your support makes a direct difference.",
    type: "donation",
    time_ago: "2 hours ago",
    read: false,
    created_at: new Date(Date.now() - 2 * 3600 * 1e3).toISOString()
  },
  {
    id: "notif_3",
    title: "Upcoming Payment",
    message: "Monthly Donation Reminder: Your scheduled contribution for the 'Emergency Dignity Kits' project is due tomorrow. Thank you for your continued commitment.",
    type: "payment",
    time_ago: "Yesterday",
    read: true,
    created_at: new Date(Date.now() - 24 * 3600 * 1e3).toISOString()
  }
];
const initialState = {
  notifications: initialNotifications,
  unreadCount: initialNotifications.filter((n) => !n.read).length
};
const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    markAsRead: (state, action) => {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif && !notif.read) {
        notif.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.read = true;
      });
      state.unreadCount = 0;
    },
    addNotification: (state, action) => {
      const newNotif = {
        id: `notif_${Date.now()}`,
        ...action.payload,
        time_ago: "Just now",
        read: false,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      state.notifications.unshift(newNotif);
      state.unreadCount += 1;
    }
  }
});
const { markAsRead, markAllAsRead, addNotification } = notificationSlice.actions;
var stdin_default = notificationSlice.reducer;
export {
  addNotification,
  stdin_default as default,
  markAllAsRead,
  markAsRead
};
