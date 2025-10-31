

const API_BASE = 'https://jsonplaceholder.typicode.com/posts';

$(function () {
  const postModal = new bootstrap.Modal(document.getElementById('postModal'));

  
  fetchPosts();

  
  $('#addPostBtn').on('click', function () {
    resetForm();
    $('#postModalLabel').text('New Post');
    postModal.show();
  });

 
  $('#savePostBtn').on('click', function () {
    const id = $('#postId').val();
    const title = $('#postTitle').val().trim();
    const body = $('#postBody').val().trim();
    if (!title || !body) {
      showToast('Please fill title and body', 'danger');
      return;
    }

    const payload = { title, body, userId: 1 };
    if (id) {
     
      showLoading(true);
      $.ajax({
        url: `${API_BASE}/${id}`,
        method: 'PUT',
        data: JSON.stringify(payload),
        contentType: 'application/json; charset=UTF-8'
      }).done(function (res) {
       
        updateRowInTable(res);
        postModal.hide();
        showToast('Post updated', 'success');
      }).fail(function () {
        showToast('Failed to update post', 'danger');
      }).always(function () { showLoading(false); });
    } else {
      // Create
      showLoading(true);
      $.ajax({
        url: API_BASE,
        method: 'POST',
        data: JSON.stringify(payload),
        contentType: 'application/json; charset=UTF-8'
      }).done(function (res) {
        // JSONPlaceholder returns the created item with an id
        prependRowToTable(res);
        postModal.hide();
        showToast('Post created', 'success');
      }).fail(function () {
        showToast('Failed to create post', 'danger');
      }).always(function () { showLoading(false); });
    }
  });

  // delegate edit and delete from table body
  $('#postsTable tbody').on('click', '.btn-edit', function () {
    const id = $(this).data('id');
    const row = $(this).closest('tr');
    const title = row.find('.post-title').text();
    const body = row.find('.post-body').text();
    $('#postId').val(id);
    $('#postTitle').val(title);
    $('#postBody').val(body);
    $('#postModalLabel').text('Edit Post');
    postModal.show();
  });

  $('#postsTable tbody').on('click', '.btn-delete', function () {
    const id = $(this).data('id');
    if (!confirm('Delete this post?')) return;
    showLoading(true);
    $.ajax({ url: `${API_BASE}/${id}`, method: 'DELETE' })
      .done(function () {
        removeRowFromTable(id);
        showToast('Post deleted', 'success');
      }).fail(function () {
        showToast('Failed to delete post', 'danger');
      }).always(function () { showLoading(false); });
  });

  // Helpers
  function fetchPosts() {
    showLoading(true);
    $.get(API_BASE).done(function (data) {
      
      renderPosts(data.slice(0, 20));
    }).fail(function () {
      showToast('Failed to load posts', 'danger');
    }).always(function () { showLoading(false); });
  }

  function renderPosts(posts) {
    const tbody = $('#postsTable tbody').empty();
    posts.forEach(post => {
      const tr = rowForPost(post);
      tbody.append(tr);
    });
  }

  function rowForPost(post) {
    const id = post.id;
    const title = escapeHtml(post.title || '');
    const body = escapeHtml(post.body || '');
    return `
      <tr data-id="${id}">
        <td>${id}</td>
        <td class="post-title">${title}</td>
        <td class="post-body">${body}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary btn-edit me-2" data-id="${id}">Edit</button>
          <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${id}">Delete</button>
        </td>
      </tr>
    `;
  }

  function prependRowToTable(post) {
    $('#postsTable tbody').prepend(rowForPost(post));
  }

  function updateRowInTable(post) {
    const selector = `#postsTable tbody tr[data-id='${post.id}']`;
    const row = $(selector);
    if (row.length) {
      row.find('.post-title').text(post.title);
      row.find('.post-body').text(post.body);
    } else {
      // if row not found, add to top
      prependRowToTable(post);
    }
  }

  function removeRowFromTable(id) {
    $(`#postsTable tbody tr[data-id='${id}']`).remove();
  }

  function resetForm() {
    $('#postId').val('');
    $('#postTitle').val('');
    $('#postBody').val('');
  }

  function showLoading(show) {
    if (show) $('#loading').removeClass('d-none'); else $('#loading').addClass('d-none');
  }

  function showToast(message, type = 'primary', timeout = 3500) {
    const id = `t${Date.now()}`;
    const toastHtml = `
      <div id="${id}" class="toast align-items-center text-bg-${type} border-0 mb-2" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">${escapeHtml(message)}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
    const $c = $('#toastContainer');
    $c.append(toastHtml);
    const toastEl = document.getElementById(id);
    const toast = new bootstrap.Toast(toastEl, { delay: timeout });
    toast.show();
    // remove after hidden
    toastEl.addEventListener('hidden.bs.toast', () => $(toastEl).remove());
  }

  function escapeHtml(unsafe) {
    return String(unsafe).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
});
