import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Heart,
  Clock,
  CheckCheck,
  Sparkles
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from "../store/slices/notificationSlice";

const timeAgo = (isoString) => {
  if (!isoString) return "";
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const NotificationsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onNavigateToCharities = () => navigate("/charities");
  const { notifications, unreadCount, loading } = useAppSelector(
    (state) => state.notification
  );

  useEffect(() => {
    dispatch(fetchNotifications());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "application_approved":
      case "application_rejected":
        return <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-900 flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>;
      case "donation_successful":
        return <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 fill-pink-600" />
          </div>;
      default:
        return <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>;
    }
  };
  return <div className="py-12 bg-slate-50 min-h-[calc(100vh-80px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {
    /* Header matching Figma */
  }
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-purple-950 font-serif">
              Notifications
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Stay updated on your contributions, receipts, and platform updates.
            </p>
          </div>

          {unreadCount > 0 && <button
    id="btn-mark-all-read"
    onClick={() => dispatch(markAllNotificationsRead())}
    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-purple-900 bg-purple-50 hover:bg-purple-100 rounded-full transition-colors border border-purple-200"
  >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all as read</span>
            </button>}
        </div>

        {
    /* Notifications List matching Figma Screenshot */
  }
        <div className="space-y-4">
          {loading && notifications.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-12">Loading notifications…</p>
          )}
          {!loading && notifications.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-12">No notifications yet.</p>
          )}
          {notifications.map((item) => <div
    key={item.id}
    id={`notification-card-${item.id}`}
    onClick={() => !item.is_read && dispatch(markNotificationRead(item.id))}
    className={`p-6 bg-white rounded-2xl border transition-all ${!item.is_read ? "border-purple-200 shadow-sm bg-purple-50/20" : "border-slate-200 shadow-xs"}`}
  >
              <div className="flex items-start gap-4">
                {getIcon(item.type)}

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-base font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                      {timeAgo(item.created_at)}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {item.message}
                  </p>

                  {
    /* Contextual Action Buttons matching Figma */
  }
                  <div className="flex flex-wrap items-center gap-2">
                    {(item.type === "application_approved" || item.type === "application_rejected") && <>
                        <button
    onClick={onNavigateToCharities}
    className="px-4 py-1.5 bg-purple-900 text-white rounded-full text-xs font-medium hover:bg-purple-950 transition-colors"
  >
                          Explore Projects
                        </button>
                      </>}

                    {item.type === "donation_successful" && <>
                        <button
    onClick={onNavigateToCharities}
    className="px-4 py-1.5 bg-purple-900 text-white rounded-full text-xs font-medium hover:bg-purple-950 transition-colors flex items-center gap-1.5"
  >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>View Impact</span>
                        </button>
                      </>}
                  </div>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};
export {
  NotificationsPage
};
