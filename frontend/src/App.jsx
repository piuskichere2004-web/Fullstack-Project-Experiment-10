
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen, LayoutDashboard, Compass, Trophy, Search, Bell,
  ChevronRight, Play, Clock, Star, Code2, Palette, BarChart3,
  Sparkles, Flame, Menu, X, LogOut, Lock, Mail
} from "lucide-react";
import { loginUser, getCurrentUser, logoutUser } from "./api/auth";
import "./index.css";
import "./App.css";

const initialCourses = [
  { id: 1, title: "Complete Web Development", category: "Development", teacher: "Alex Morgan", lessons: 32, hours: "8h 20m", rating: 4.9, color: "violet", icon: Code2, progress: 68, enrolled: true },
  { id: 2, title: "UI/UX Design Masterclass", category: "Design", teacher: "Sarah Chen", lessons: 24, hours: "6h 10m", rating: 4.8, color: "pink", icon: Palette, progress: 35, enrolled: true },
  { id: 3, title: "Data Science Essentials", category: "Data Science", teacher: "David Kim", lessons: 28, hours: "7h 45m", rating: 4.9, color: "blue", icon: BarChart3, progress: 0, enrolled: false },
  { id: 4, title: "Digital Marketing", category: "Business", teacher: "Emma Wilson", lessons: 20, hours: "5h 30m", rating: 4.7, color: "orange", icon: Sparkles, progress: 0, enrolled: false },
  { id: 5, title: "Python Programming", category: "Development", teacher: "Ryan Patel", lessons: 36, hours: "9h 15m", rating: 4.9, color: "green", icon: Code2, progress: 0, enrolled: false },
  { id: 6, title: "Creative Design Basics", category: "Design", teacher: "Mia Brooks", lessons: 18, hours: "4h 40m", rating: 4.8, color: "yellow", icon: Palette, progress: 0, enrolled: false },
];

const categories = [
  "All Courses", "Development", "Design", "Data Science", "Business"
];

export default function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const [page, setPage] = useState("Dashboard");
  const [category, setCategory] = useState("All Courses");
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState(initialCourses);
  const [notice, setNotice] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("learnsphere_token");

    if (!token) {
      setCheckingSession(false);
      return;
    }

    getCurrentUser()
      .then((currentUser) => setUser(currentUser))
      .catch(() => {
        logoutUser();
        setUser(null);
      })
      .finally(() => setCheckingSession(false));
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      await loginUser(username.trim(), password);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setPassword("");
    } catch (error) {
      logoutUser();

      if (error.response?.status === 401) {
        setLoginError("Incorrect username or password. Please try again.");
      } else {
        setLoginError(
          "Unable to connect to LearnSphere. Check that the backend is running."
        );
      }
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    logoutUser();
    setUser(null);
    setPassword("");
    setLoginError("");
    setPage("Dashboard");
    setNotice("");
  }

  const enrolled = courses.filter(course => course.enrolled);

  const visibleCourses = useMemo(() => courses.filter(course => {
    const categoryMatch =
      category === "All Courses" || course.category === category;
    const searchMatch =
      `${course.title} ${course.teacher} ${course.category}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const pageMatch = page !== "My Learning" || course.enrolled;

    return categoryMatch && searchMatch && pageMatch;
  }), [courses, category, search, page]);

  function navigate(nextPage) {
    setPage(nextPage);
    setCategory("All Courses");
    setNotice("");
    setMenuOpen(false);
  }

  function enroll(id) {
    setCourses(old => old.map(course =>
      course.id === id ? { ...course, enrolled: true } : course
    ));
    setNotice("Success! Your course has been added to My Learning.");
  }

  if (checkingSession) {
    return (
      <div className="login-page">
        <div className="login-card login-loading-card">
          <div className="login-logo"><BookOpen size={30} /></div>
          <h2>LearnSphere</h2>
          <p>Preparing your learning space...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="login-page">
        <div className="login-decoration login-decoration-one" />
        <div className="login-decoration login-decoration-two" />

        <div className="login-card">
          <div className="login-brand">
            <div className="login-logo"><BookOpen size={30} /></div>
            <h1>Learn<span>Sphere</span></h1>
          </div>

          <p className="login-eyebrow">YOUR LEARNING JOURNEY STARTS HERE</p>
          <h2>Welcome back!</h2>
          <p className="login-subtitle">
            Sign in to continue learning and growing.
          </p>

          <form className="login-form" onSubmit={handleLogin}>
            <label htmlFor="username">Username</label>
            <div className="login-input">
              <Mail size={18} />
              <input
                id="username"
                type="text"
                value={username}
                onChange={event => setUsername(event.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                required
              />
            </div>

            <label htmlFor="password">Password</label>
            <div className="login-input">
              <Lock size={18} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            {loginError && (
              <p className="login-error" role="alert">{loginError}</p>
            )}

            <button
              className="login-submit"
              type="submit"
              disabled={loginLoading}
            >
              {loginLoading ? "Signing in..." : "Sign in to LearnSphere"}
              {!loginLoading && <ChevronRight size={18} />}
            </button>
          </form>

          <div className="login-note">
            <Lock size={14} />
            Secure sign-in powered by JWT authentication
          </div>

          <p className="login-footer">Learn today. Lead tomorrow.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {menuOpen && (
        <button
          className="mobile-scrim"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        />
      )}

      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><BookOpen size={25} /></div>
          <span>Learn<span className="brand-light">Sphere</span></span>
          <button
            className="close-menu"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X />
          </button>
        </div>

        <div className="workspace-label">LEARNING SPACE</div>

        <nav className="nav-list">
          {[
            ["Dashboard", LayoutDashboard],
            ["Explore Courses", Compass],
            ["My Learning", BookOpen],
            ["Achievements", Trophy]
          ].map(([name, Icon]) => (
            <button
              key={name}
              onClick={() => navigate(name)}
              className={`nav-link ${page === name ? "active" : ""}`}
            >
              <Icon size={19} />
              <span>{name}</span>
              {name === "My Learning" &&
                <span className="nav-count">{enrolled.length}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="streak-card">
            <div className="streak-icon"><Flame size={23} /></div>
            <div>
              <strong>Keep it going!</strong>
              <p>Every lesson counts.</p>
            </div>
          </div>

          <div className="profile">
            <div className="avatar">
              {(user.fullName || user.username || "LS")
                .split(" ")
                .map(part => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="profile-info">
              <strong>{user.fullName || user.username}</strong>
              <span>{user.role || "Student"}</span>
            </div>
            <span className="online-dot" />
          </div>

          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={17} />
            Log out
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu />
          </button>

          <div className="breadcrumb">
            LearnSphere <ChevronRight size={15} /> <strong>{page}</strong>
          </div>

          <div className="top-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search courses..."
              />
            </div>
            <button
              className="icon-button"
              title="Notifications"
              onClick={() => setNotice("You're all caught up!")}
            >
              <Bell size={19} />
            </button>
            <div className="avatar top-avatar">
              {(user.fullName || user.username || "LS")
                .split(" ")
                .map(part => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          </div>
        </header>

        <div className="page-content">
          <section className={`welcome-banner ${page === "Achievements" ? "achievement-banner" : ""}`}>
            <div className="welcome-copy">
              <span className="eyebrow">
                <Sparkles size={15} /> YOUR FUTURE STARTS HERE
              </span>
              <h1>Learn something<br /><span>amazing today.</span></h1>
              <p>
                Welcome back, {user.fullName || user.username}!
                Keep building skills that open new doors.
              </p>
              <button
                className="primary-button"
                onClick={() => navigate("Explore Courses")}
              >
                Explore courses <ChevronRight size={18} />
              </button>
            </div>

            <div className="banner-art">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="hero-book">
                <BookOpen size={76} strokeWidth={1.4} />
              </div>
              <div className="floating-card float-top">
                <Star size={16} fill="currentColor" /> 4.9
                <small>course rating</small>
              </div>
              <div className="floating-card float-bottom">
                <Trophy size={20} />
                <span><strong>Dream big!</strong><small>You're on your way</small></span>
              </div>
            </div>
          </section>

          {notice && (
            <div className="notice">
              <span>{notice}</span>
              <button onClick={() => setNotice("")} aria-label="Dismiss">
                <X size={16} />
              </button>
            </div>
          )}

          <section className="section-heading">
            <div>
              <span className="section-kicker">YOUR LEARNING JOURNEY</span>
              <h2>
                {page === "My Learning" ? "My Learning"
                  : page === "Achievements" ? "Your achievements"
                  : page === "Explore Courses" ? "Find your next skill"
                  : "Your dashboard"}
              </h2>
            </div>
            <button
              className="text-button"
              onClick={() => navigate(
                page === "My Learning" ? "Explore Courses" : "My Learning"
              )}
            >
              {page === "My Learning" ? "Explore more" : "My learning"}
              <ChevronRight size={16} />
            </button>
          </section>

          <section className="stats-grid">
            <div className="stat-card stat-purple">
              <div className="stat-icon"><BookOpen /></div>
              <span>Enrolled courses</span>
              <strong>{enrolled.length}</strong>
              <small>Keep exploring ✨</small>
            </div>
            <div className="stat-card stat-pink">
              <div className="stat-icon"><Trophy /></div>
              <span>Lessons completed</span>
              <strong>{courses.reduce((sum, c) => sum + Math.floor(c.progress * c.lessons / 100), 0)}</strong>
              <small>Every lesson matters</small>
            </div>
            <div className="stat-card stat-blue">
              <div className="stat-icon"><Clock /></div>
              <span>Courses available</span>
              <strong>{courses.length}</strong>
              <small>More to discover</small>
            </div>
            <div className="stat-card stat-orange">
              <div className="stat-icon"><Flame /></div>
              <span>Learning streak</span>
              <strong>3 days</strong>
              <small>You're doing great!</small>
            </div>
          </section>

          <section className="section-heading course-heading">
            <div>
              <span className="section-kicker">HANDPICKED FOR YOU</span>
              <h2>
                {page === "My Learning"
                  ? "Pick up where you left off"
                  : "Discover popular courses"}
              </h2>
            </div>
            <span className="course-total">{visibleCourses.length} courses</span>
          </section>

          <div className="category-row">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`category-chip ${category === cat ? "selected" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {visibleCourses.length ? (
            <div className="course-grid">
              {visibleCourses.map(course => {
                const Icon = course.icon;

                return (
                  <article className="course-card" key={course.id}>
                    <div className={`course-cover cover-${course.color}`}>
                      <span className="cover-tag">{course.category}</span>
                      <div className="cover-illustration">
                        <Icon size={55} strokeWidth={1.4} />
                      </div>
                      <span className="cover-number">0{course.id}</span>
                    </div>

                    <div className="course-body">
                      <div className="course-rating">
                        <Star size={15} fill="currentColor" />
                        {course.rating}
                        <span>({course.lessons} lessons)</span>
                      </div>
                      <h3>{course.title}</h3>
                      <p className="teacher-line">
                        <span className="teacher-avatar">
                          {course.teacher.split(" ").map(part => part[0]).join("")}
                        </span>
                        {course.teacher}
                      </p>
                      <div className="course-meta">
                        <span><Play size={14} /> {course.lessons} lessons</span>
                        <span><Clock size={14} /> {course.hours}</span>
                      </div>

                      {course.enrolled ? (
                        <div className="progress-area">
                          <div className="progress-label">
                            <span>Course progress</span>
                            <strong>{course.progress}%</strong>
                          </div>
                          <div className="progress-track">
                            <div style={{ width: `${course.progress}%` }} />
                          </div>
                          <button
                            className="continue-button"
                            onClick={() => setNotice(
                              `Next, we'll connect ${course.title} to real lessons.`
                            )}
                          >
                            Continue learning <ChevronRight size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="enroll-button"
                          onClick={() => enroll(course.id)}
                        >
                          Enroll for free <ChevronRight size={17} />
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <BookOpen size={38} />
              <h3>No courses found</h3>
              <p>Try another search or category.</p>
              <button
                className="primary-button"
                onClick={() => {
                  setSearch("");
                  setCategory("All Courses");
                }}
              >
                Clear filters
              </button>
            </div>
          )}

          <footer className="footer">
            <span>© 2026 LearnSphere</span>
            <span>Learn today. Lead tomorrow. ✨</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
