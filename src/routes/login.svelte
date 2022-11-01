<script>
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';

	function signIn() {
		goto('/user/settings');
	}
</script>

<!-- BEGIN login -->
<div class="login clean" transition:fade>
	<!-- BEGIN login-content -->
	<div class="login-content">
		<form>
			<h1 class="text-center">Sign In</h1>
			<div class="text-white text-opacity-50 text-center mb-4">
				For your protection, please verify your identity.
			</div>
			<div class="mb-3">
				<label class="form-label" for="email">Email Address <span class="text-danger">*</span></label>
				<input type="text" class="form-control form-control-lg bg-white bg-opacity-5" value="" placeholder="" />
			</div>
			<div class="mb-3">
				<div class="d-flex">
					<label class="form-label" for="password">Password <span class="text-danger">*</span></label>
					<a href="#forgot" class="ms-auto text-white text-decoration-none text-opacity-50">Forgot password?</a>
				</div>
				<input type="password" class="form-control form-control-lg bg-white bg-opacity-5" value="" placeholder="" />
			</div>
			<div class="mb-3">
				<div class="form-check">
					<input class="form-check-input" type="checkbox" value="" id="customCheck1" />
					<label class="form-check-label" for="customCheck1">Remember me</label>
				</div>
			</div>
			<button type="button" on:click={signIn} class="btn btn-outline-theme btn-lg d-block w-100 fw-500 mb-3">Sign In</button>
			<div class="text-center text-white text-opacity-50">
				Don't have an account yet? <a href="register">Sign up</a>.
			</div>
		</form>
	</div>
	<!-- END login-content -->
</div>
<!-- END login -->