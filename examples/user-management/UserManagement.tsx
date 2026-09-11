import { useEffect, useState } from 'react';

/**
 * Example target for QASkill acceptance Scenario B (spec section 76).
 *
 * Visible elements: search input, status filter, "Add user" button, table with
 * row actions (Edit / Delete), and pagination.
 *
 * Evidence the AI can extract:
 *   - debounce is implemented (300ms) for search
 *   - the table has loading, error, empty and no-result states
 *   - delete opens a confirmation modal
 *   - previous page is disabled on page 1
 *
 * Unknown (must NOT be invented): page size, delete permissions, default sort,
 * status values, unique constraints.
 */
interface User {
  id: string;
  name: string;
  email: string;
  status: string;
}

export function UserManagement() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const pageSize = 10;

  useEffect(() => {
    const handle = setTimeout(() => {
      void loadUsers();
    }, 300);
    return () => clearTimeout(handle);
  }, [search, status, page]);

  async function loadUsers(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        search,
        status,
        page: String(page),
        pageSize: String(pageSize),
      });
      const response = await fetch(`/api/users?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Request failed');
      }
      const payload = (await response.json()) as { items: User[]; total: number };
      setUsers(payload.items);
      setTotal(payload.total);
    } catch {
      setError('Could not load users.');
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete(): Promise<void> {
    if (!deleteTarget) {
      return;
    }
    const response = await fetch(`/api/users/${deleteTarget.id}`, { method: 'DELETE' });
    setDeleteTarget(null);
    if (response.ok) {
      await loadUsers();
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section>
      <header>
        <h1>User management</h1>
        <button type="button">Add user</button>
      </header>

      <div role="search">
        <label htmlFor="user-search">Search</label>
        <input
          id="user-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <label htmlFor="status-filter">Status</label>
        <select
          id="status-filter"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? <p>Loading…</p> : null}
      {error ? <p role="alert">{error}</p> : null}

      {!loading && !error && users.length === 0 ? <p>No users found.</p> : null}

      {users.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.status}</td>
                <td>
                  <button type="button">Edit</button>
                  <button type="button" onClick={() => setDeleteTarget(user)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      <nav aria-label="Pagination">
        <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button type="button" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </nav>

      {deleteTarget ? (
        <div role="dialog" aria-modal="true">
          <p>Delete {deleteTarget.name}? This cannot be undone.</p>
          <button type="button" onClick={() => setDeleteTarget(null)}>
            Cancel
          </button>
          <button type="button" onClick={() => void confirmDelete()}>
            Confirm
          </button>
        </div>
      ) : null}
    </section>
  );
}
