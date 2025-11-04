import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerDeliveryAPI, loginAPI } from "./AuthAPI";

/* ================= Helpers ================= */

// فكّ base64url لقراءة حمولة الـ JWT بدون مكتبة خارجية
const base64UrlDecode = (str) => {
  try {
    const pad = (s) => s + "===".slice((s.length + 3) % 4);
    const b64 = pad(str.replace(/-/g, "+").replace(/_/g, "/"));
    const json = decodeURIComponent(
      [...atob(b64)]
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const decodeJwtPayload = (token) => {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  return base64UrlDecode(parts[1]);
};

// يطلّع الدور من حمولة التوكن أو الرد
const extractRole = (payloadOrResponse) => {
  const p = payloadOrResponse?.payload || payloadOrResponse || null;
  const role = p?.role ?? p?.user?.role ?? p?.claims?.role ?? null;
  return typeof role === "string" ? role.toLowerCase() : null;
};

// نفس دالتك مع fallback للـ id من الـ token
const extractUserId = (user, tokenPayload) =>
  Number(
    user?.id ??
      user?.user_id ??
      user?.delivery_id ??
      user?.vendor_id ??
      user?.customer_id ??
      user?.deliveryId ??
      user?.vendorId ??
      user?.customerId ??
      tokenPayload?.id ??
      tokenPayload?.sub
  ) || null;

/* ================= Thunks ================= */

// التسجيل نفسه (ما لمسناه)
export const registerDelivery = createAsyncThunk(
  "auth/registerDelivery",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await registerDeliveryAPI(formData);
      return response; // غالبًا { message, user }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// تسجيل الدخول: نفكّ الـ JWT ونفحص role === "delivery"
export const loginDelivery = createAsyncThunk(
  "auth/loginDelivery",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await loginAPI(formData);
      // متوقع: { message, token } من الباك-إند الحالي
      const token = response?.token;
      if (!token) {
        return rejectWithValue("Login failed: missing token.");
      }

      const payload = decodeJwtPayload(token);
      if (!payload) {
        return rejectWithValue("Login failed: invalid token.");
      }

      const role = extractRole({ payload });
      if (role !== "delivery") {
        return rejectWithValue("This portal is for delivery accounts only.");
      }

      // نبني user بسيط من حمولة التوكن (الرد ما فيه user)
      const user = {
        id: payload?.id ?? payload?.sub ?? null,
        role,
        email: payload?.email ?? undefined, // لو الباك يضيفها بالـ claims
      };

      return { token, user, message: response?.message || "Login successful" };
    } catch (err) {
      return rejectWithValue(err.message || "Login failed");
    }
  }
);

/* ================= Slice ================= */

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setUserFromToken: (state, action) => {
      // في حال رجعنا نحتاج نعيد البناء من توكن مخزن
      const token = action.payload?.token;
      const givenUser = action.payload?.user;

      let user = givenUser || null;

      if (token && !user) {
        const payload = decodeJwtPayload(token);
        if (payload) {
          const role = extractRole({ payload });
          user = {
            id: payload?.id ?? payload?.sub ?? null,
            role,
            email: payload?.email ?? undefined,
          };
        }
      }

      state.user = user;
      state.token = token;

      const payload = token ? decodeJwtPayload(token) : null;
      const userId = extractUserId(user, payload);
      if (userId) localStorage.setItem("userId", String(userId));
      if (token) localStorage.setItem("token", token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.successMessage = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("deliveryId");
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerDelivery.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerDelivery.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null; // غالبًا مافيش توكن هنا
        state.successMessage = " Delivery registered successfully!";

        const userId = extractUserId(action.payload.user, null);
        if (userId) localStorage.setItem("userId", String(userId));

        const deliveryId = action.payload.user?.id || userId;
        if (deliveryId) localStorage.setItem("deliveryId", String(deliveryId));

        if (action.payload.token)
          localStorage.setItem("token", action.payload.token);
      })
      .addCase(registerDelivery.rejected, (state, action) => {
        state.loading = false;
        state.error =  action.payload;
      })

      // Login
      .addCase(loginDelivery.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginDelivery.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // {id, role, email?}
        state.token = action.payload.token;
        state.successMessage = " Login successful!";

        const payload = decodeJwtPayload(action.payload.token);
        const userId = extractUserId(action.payload.user, payload);
        if (userId) localStorage.setItem("userId", String(userId));

        const deliveryId = action.payload.user?.id || userId;
        if (deliveryId) localStorage.setItem("deliveryId", String(deliveryId));

        if (action.payload.token)
          localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginDelivery.rejected, (state, action) => {
        state.loading = false;
        state.error =  action.payload;
      });
  },
});

export const { clearMessages, setUserFromToken, logout } = authSlice.actions;
export default authSlice.reducer;
