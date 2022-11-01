<script>
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';

	function signIn() {
		goto('/user/settings');
	}
</script>

<!-- BEGIN register -->
<div class="register clean" transition:fade>
	<!-- BEGIN register-content -->
	<div class="register-content">
		<form name="register_form">
			<h1 class="text-center">Sign Up</h1>
			<p class="text-white text-opacity-50 text-center">Start a FREE account today!</p>
			<div class="mb-3">
				<label class="form-label">Name <span class="text-danger">*</span></label>
				<input type="text" class="form-control form-control-lg bg-white bg-opacity-5" placeholder="e.g John Smith" value="" />
			</div>
			<div class="mb-3">
				<label class="form-label">Email Address <span class="text-danger">*</span></label>
				<input type="text" class="form-control form-control-lg bg-white bg-opacity-5" placeholder="username@address.com" value="" />
			</div>
			<div class="mb-3">
				<label class="form-label">Password <span class="text-danger">*</span></label>
				<input type="password" class="form-control form-control-lg bg-white bg-opacity-5" value="" />
			</div>
			<div class="mb-3">
				<label class="form-label">Confirm Password <span class="text-danger">*</span></label>
				<input type="password" class="form-control form-control-lg bg-white bg-opacity-5" value="" />
			</div>

			<!-- <div class="mb-3">
				<label class="form-label">Country <span class="text-danger">*</span></label>
				<select class="form-select form-select-lg bg-white bg-opacity-5">
					<option>United States</option>
				</select>
			</div>
			<div class="mb-3">
				<label class="form-label">Gender <span class="text-danger">*</span></label>
				<select class="form-select form-select-lg bg-white bg-opacity-5">
					<option>Female</option>
				</select>
			</div>
			<div class="mb-3">
				<label class="form-label">Date of Birth <span class="text-danger">*</span></label>
				<div class="row gx-2">
					<div class="col-6">
						<select class="form-select form-select-lg bg-white bg-opacity-5">
							<option>Month</option>
						</select>
					</div>
					<div class="col-3">
						<select class="form-select form-select-lg bg-white bg-opacity-5">
							<option>Day</option>
						</select>
					</div>
					<div class="col-3">
						<select class="form-select form-select-lg bg-white bg-opacity-5">
							<option>Year</option>
						</select>
					</div>
				</div>
			</div> -->

			<div class="mb-3">
				<div class="form-check">
					<input class="form-check-input" type="checkbox" value="" id="customCheck1" />
					<label class="form-check-label" for="customCheck1">I have read and agree to the <a href="#terms">Terms of Use</a> and <a href="#policy">Privacy Policy</a>.</label>
				</div>
			</div>
			<div class="mb-3">
				<button type="button" on:click={signIn} class="btn btn-outline-theme btn-lg d-block w-100">Sign Up</button>
			</div>
			<div class="text-white text-opacity-50 text-center">
				Already have an Account? <a href="login">Sign In</a>
			</div>
		</form>
	</div>
	<!-- END register-content -->
</div>
<!-- END register -->
